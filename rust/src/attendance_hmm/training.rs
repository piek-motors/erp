use std::{error::Error, path::PathBuf};

use hmmm::HMM;
use ndarray::{Array1, Array2};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;

use super::{
  dataset::{self, split_dataset, Dataset},
  normalization::normalize_arr2,
  observation::{events_to_observations, Observation},
  state::State,
  training_data::TrainingData,
};

fn weights_path() -> PathBuf {
  PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("weights.json")
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Weights {
  pub transition: Array2<f64>,
  pub emission: Array2<f64>,
  pub initial_probs: Array1<f64>,
}

impl Weights {
  pub fn persist(&self) -> Result<(), Box<dyn Error>> {
    let serialized_weights = serde_json::to_string(self)?;
    std::fs::write(weights_path(), serialized_weights)?;
    Ok(())
  }

  pub fn load() -> Result<Self, Box<dyn Error>> {
    let serialized = std::fs::read(weights_path())?;
    Ok(serde_json::from_slice(&serialized)?)
  }

  pub fn into_model(self) -> HMM {
    HMM::new(self.transition, self.emission, self.initial_probs)
  }
}

pub fn train_hmm(test_ratio: f32) -> Result<(), Box<dyn Error>> {
  let Dataset { test, train } = split_dataset(dataset::ls_dir()?, test_ratio as f64);

  let mut training_data = TrainingData::new(State::iter().count(), Observation::iter().count());

  for dataset_path in &train {
    let mut events = dataset::load_dataset(dataset_path);
    events.sort_by_key(|e| e.t);

    // Convert to (EmployeeEvent, State) tuples
    let events_with_state: Vec<(super::observation::EmployeeEvent, State)> = events
      .into_iter()
      .map(|e| {
        (
          super::observation::EmployeeEvent { id: e.id, t: e.t },
          e.state,
        )
      })
      .collect();

    // Apply suppress_bursts directly on tuples - preserves state alignment!
    let events_deduped = super::observation::suppress_bursts(events_with_state);

    let timestamps: Vec<_> = events_deduped.iter().map(|(e, _)| e.t).collect();
    let deltas = super::observation::move_to_deltas(&timestamps);

    // Associate each delta with the state at the END of the interval
    // delta[i] = timestamps[i+1] - timestamps[i] (duration of interval)
    // state[i+1] = state of event at end of interval (what happened: entry/exit)
    let states: Vec<State> = events_deduped
      .iter()
      .skip(1)  // skip first event (no previous event to calculate delta from)
      .map(|(_, s)| *s)
      .collect();

    assert!(
      !states.iter().all(|s| *s == State::Outside),
      "dataset {} doesnt labeled: check if its labeled",
      dataset_path.to_string_lossy()
    );

    training_data.add_delta_sequence(deltas, states);
  }

  let weights = train_mle(&training_data);
  weights.persist()?;

  let model = weights.into_model();

  let mut errors = 0;
  let mut predictions = 0;

  for dataset_path in &test {
    println!("\nTest on dataset {:?}", dataset_path);
    let mut events = dataset::load_dataset(dataset_path);
    events.sort_by_key(|e| e.t);

    let observations = events_to_observations(&events);
    let states = model.most_likely_sequence(&observations);

    assert_eq!(events.len() - 1, states.len());

    events.iter().skip(1).enumerate().for_each(|(idx, t)| {
      let model_predicted_state = states
        .get(idx)
        .expect("no value produced by mode for event");

      predictions += 1;
      if t.state as usize != *model_predicted_state {
        println!(
          "Error: event {} expects {} actual {}",
          t.id, t.state as u32, model_predicted_state
        );
        errors += 1;
      }
    });
  }

  let loss = errors as f64 / predictions as f64;
  println!("Loss {:.3}%", loss * 100.0);
  println!("Predictions {}, errors {}", predictions, errors,);
  Ok(())
}

/// Train an HMM using Maximum Likelihood Estimation
///
/// # Arguments
/// * `training_data` - The training sequences
///
/// # Returns
/// Trained HMM parameters (transition matrix A, emission matrix B, initial state probabilities π)
///
/// # Algorithm
/// MLE estimates parameters by counting:
/// - A[i,j] = P(state j | state i) = count(i→j) / count(i→*)
/// - B[i,o] = P(obs o | state i) = count(state=i, obs=o) / count(state=i)
/// - π[i] = P(initial state = i) = count(sequences starting with i) / total sequences
fn train_mle(training_data: &TrainingData) -> Weights {
  let n_states = training_data.n_states;
  let n_obs = training_data.n_observations;

  // Initialize count matrices
  let mut transition_counts = Array2::<f64>::zeros((n_states, n_states));
  let mut emission_counts = Array2::<f64>::zeros((n_states, n_obs));
  let mut initial_counts = Array1::<f64>::zeros(n_states);

  // Count occurrences
  for (seq_idx, (states, observations)) in training_data
    .state_seq
    .iter()
    .zip(training_data.observation_seq.iter())
    .enumerate()
  {
    println!(
      "Processing sequence {}/{}",
      seq_idx + 1,
      training_data.num_sequences()
    );

    if states.is_empty() {
      println!("  Warning: Empty sequence, skipping");
      continue;
    }

    // Count initial state
    let initial_state = states[0];
    initial_counts[initial_state] += 1.0;

    // Count transitions and emissions
    for t in 0..states.len() {
      let state = states[t];
      let obs = observations[t];

      // Count emission: state -> observation
      emission_counts[[state, obs]] += 1.0;

      // Count transition: state[t] -> state[t+1]
      if t + 1 < states.len() {
        let next_state = states[t + 1];
        transition_counts[[state, next_state]] += 1.0;
      }
    }
  }

  let transition = normalize_arr2(&transition_counts);
  let emission = normalize_arr2(&emission_counts);

  let initial_sum = initial_counts.sum();
  let initial_probs = if initial_sum > 0.0 {
    &initial_counts / initial_sum
  } else {
    Array1::from_elem(n_states, 1.0 / n_states as f64)
  };

  Weights {
    transition,
    emission,
    initial_probs,
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_train_hmm() {
    train_hmm(0.01).unwrap();
  }
}
