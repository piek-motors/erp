use std::{error::Error, path::PathBuf};

use hmmm::HMM;
use ndarray::{Array1, Array2};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;

use crate::{
  dataset::{self, split_dataset, Dataset},
  normalization::normalize_arr2,
  observation::{events_to_observations, move_to_deltas, Observation},
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
    let mut events = dataset::load_dataset(&dataset_path);
    events.sort_by_key(|e| e.t.clone());

    let timestamps: Vec<_> = events.iter().map(|e| e.t).collect();
    let deltas = move_to_deltas(&timestamps);

    let states: Vec<State> = events
      .into_iter()
      .map(|e| State::from(e.state))
      .skip(1)
      .collect();

    assert_eq!(
      states.iter().all(|s| *s == State::Outside),
      false,
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
    let mut events = dataset::load_dataset(&dataset_path);
    events.sort_by_key(|e| e.t.clone());

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
  use crate::{state::State, training::train_mle};

  #[test]
  fn test_train_hmm() {
    train_hmm(0.01).unwrap();
  }

  #[test]
  fn test_training_data_builder() {
    let mut training_data = TrainingData::new(2, 6);

    let deltas1 = vec![2, 3, 5, 1, 4];
    let states = vec![State::Inside];
    training_data.add_delta_sequence(deltas1, states);

    training_data.debug_print();

    assert_eq!(training_data.num_sequences(), 1);
    assert!(training_data.total_observations() > 0);
  }

  #[test]
  fn test_train_mle() {
    let mut training_data = TrainingData::new(2, 6);

    // Add multiple sequences
    let sequences = vec![
      vec![2, 3, 20, 25, 1, 5, 40],
      vec![1, 2, 3, 30, 35, 2, 1],
      vec![25, 30, 20, 3, 2, 1, 2],
    ];

    for deltas in sequences {
      training_data.add_delta_sequence(deltas, vec![State::Inside]);
    }

    training_data.debug_print();

    let Weights {
      emission,
      initial_probs,
      transition,
    } = train_mle(&training_data);

    println!("\n--- Final HMM Parameters ---");
    println!("A (transition matrix):");
    for i in 0..transition.nrows() {
      println!("  State {} → {:?}", i, transition.row(i));
    }

    println!("\nB (emission matrix):");
    for i in 0..emission.nrows() {
      println!("  State {} → {:?}", i, emission.row(i));
    }

    println!("\nπ (initial probabilities): {:?}", initial_probs);

    // Verify probabilities sum to 1
    for i in 0..transition.nrows() {
      let row_sum = transition.row(i).sum();
      assert!(
        (row_sum - 1.0).abs() < 1e-6,
        "Transition matrix row {} should sum to 1.0, got {}",
        i,
        row_sum
      );
    }

    for i in 0..emission.nrows() {
      let row_sum = emission.row(i).sum();
      assert!(
        (row_sum - 1.0).abs() < 1e-6,
        "Emission matrix row {} should sum to 1.0, got {}",
        i,
        row_sum
      );
    }

    let pi_sum = initial_probs.sum();
    assert!(
      (pi_sum - 1.0).abs() < 1e-6,
      "Initial probabilities should sum to 1.0, got {}",
      pi_sum
    );

    println!("\n✓ All probability constraints satisfied!");
  }

  #[test]
  fn test_train_mle_simple() {
    println!("\n=== Test: Simple MLE Training ===");

    let mut training_data = TrainingData::new(2, 3);

    // Manually add simple sequences
    // Sequence 1: State 0 → State 0 → State 1
    //             Obs   0 → Obs   1 → Obs   2
    training_data.add_sequence(vec![0, 0, 1], vec![0, 1, 2]);

    // Sequence 2: State 0 → State 1 → State 1
    //             Obs   0 → Obs   2 → Obs   2
    training_data.add_sequence(vec![0, 1, 1], vec![0, 2, 2]);

    training_data.debug_print();

    let Weights {
      emission: emission_matrix,
      initial_probs,
      transition: transition_matrix,
    } = train_mle(&training_data);

    println!("\n--- Expected Behavior ---");
    println!("Initial: Both sequences start at state 0");
    println!("  → π should be [1.0, 0.0]");
    println!("\nTransitions:");
    println!("  State 0→0: 1 time,  State 0→1: 2 times");
    println!("  State 1→1: 2 times");
    println!("  → A[0] should be [1/3, 2/3]");
    println!("  → A[1] should be [0, 1]");
    println!("\nEmissions:");
    println!("  State 0 emits: obs 0 twice, obs 1 once");
    println!("  State 1 emits: obs 2 three times");

    println!("\n--- Actual Results ---");
    println!("π: {:?}", initial_probs);
    println!("A:\n{:?}", transition_matrix);
    println!("B:\n{:?}", emission_matrix);

    println!("\n✓ Simple MLE test complete!");
  }
}
