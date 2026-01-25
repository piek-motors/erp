use std::path::Path;

use ndarray::{Array1, Array2};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;

use crate::{
  dataset,
  normalization::normalize_arr2,
  observation::{deltas_to_observations, move_to_deltas, parse_datetime_or_panic, Observation},
  state::State,
};

const WEIGHTS_PATH_STR: &str = "./weights.dat";
fn weights_path() -> &'static Path {
  Path::new(WEIGHTS_PATH_STR)
}

pub struct HMMTrainingData {
  pub state_seq: Vec<Vec<usize>>,
  pub observation_seq: Vec<Vec<usize>>,
  pub n_states: usize,
  pub n_observations: usize,
}

impl HMMTrainingData {
  pub fn new(n_states: usize, n_observations: usize) -> Self {
    Self {
      state_seq: Vec::new(),
      observation_seq: Vec::new(),
      n_states,
      n_observations,
    }
  }

  /// Add a single training sequence
  pub fn add_sequence(&mut self, states: Vec<usize>, observations: Vec<usize>) {
    assert_eq!(
      states.len(),
      observations.len(),
      "States and observations must have same length"
    );
    self.state_seq.push(states);
    self.observation_seq.push(observations);
  }

  /// Add a sequence from delta times
  pub fn add_delta_sequence(&mut self, deltas: Vec<u32>, states: Vec<State>) {
    let observations: Vec<usize> = deltas_to_observations(deltas.clone())
      .iter()
      .map(|obs| obs.as_index())
      .collect();

    let states: Vec<usize> = states.into_iter().map(|delta| delta.into()).collect();

    self.add_sequence(states, observations);
  }

  /// Get total number of sequences
  pub fn num_sequences(&self) -> usize {
    self.state_seq.len()
  }

  /// Get total number of observations across all sequences
  pub fn total_observations(&self) -> usize {
    self.observation_seq.iter().map(|seq| seq.len()).sum()
  }

  /// Print debug information about the training data
  pub fn debug_print(&self) {
    println!("\n=== HMM Training Data Summary ===");
    println!("Number of sequences: {}", self.num_sequences());
    println!("Total observations: {}", self.total_observations());
    println!("Number of states: {}", self.n_states);
    println!("Number of observation types: {}", self.n_observations);

    for (i, (states, obs)) in self
      .state_seq
      .iter()
      .zip(self.observation_seq.iter())
      .enumerate()
    {
      println!("\n--- Sequence {} (length: {}) ---", i + 1, states.len());
      println!("States:       {:?}", states);
      println!("Observations: {:?}", obs);
    }
    println!("\n=================================\n");
  }
}

#[derive(Serialize, Deserialize)]
pub struct HmmWeights {
  pub transition: Array2<f64>,
  pub emission: Array2<f64>,
  pub initial_probs: Array1<f64>,
}

pub fn train_hmm() -> Result<(), Box<dyn std::error::Error>> {
  let data_sets = dataset::ls_dir()?;
  let mut training_data = HMMTrainingData::new(State::iter().count(), Observation::iter().count());

  for dataset_path in data_sets {
    let mut events = dataset::load_dataset(&dataset_path);
    events.sort_by_key(|e| e.t.clone());

    let timestamps: Vec<_> = events
      .iter()
      .map(|e| parse_datetime_or_panic(&e.t))
      .collect();
    let deltas = move_to_deltas(&timestamps);

    let states: Vec<State> = events
      .into_iter()
      .map(|e| State::from(e.state))
      .skip(1)
      .collect();

    assert_eq!(
      states.iter().all(|s| *s == State::Outside),
      true,
      "dataset {} dosnt marked and cannot be used for taining",
      dataset_path.to_string_lossy()
    );

    training_data.add_delta_sequence(deltas, states);
  }

  let weights = train_mle(&training_data);

  let serialized_weights = serde_json::to_string(&weights)?;
  std::fs::write(weights_path(), serialized_weights)?;

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
pub fn train_mle(training_data: &HMMTrainingData) -> HmmWeights {
  println!("\n=== Starting MLE Training ===");

  let n_states = training_data.n_states;
  let n_obs = training_data.n_observations;

  // Initialize count matrices
  let mut transition_counts = Array2::<f64>::zeros((n_states, n_states));
  let mut emission_counts = Array2::<f64>::zeros((n_states, n_obs));
  let mut initial_counts = Array1::<f64>::zeros(n_states);

  println!("Counting transitions and emissions...");

  // Count occurrences
  for (seq_idx, (states, observations)) in training_data
    .state_seq
    .iter()
    .zip(training_data.observation_seq.iter())
    .enumerate()
  {
    println!(
      "\nProcessing sequence {}/{}",
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
    println!("  Initial state: {}", initial_state);

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

    println!("  Processed {} time steps", states.len());
  }

  println!("\n--- Count Matrices ---");
  println!("Transition counts:\n{:?}", transition_counts);
  println!("\nEmission counts:\n{:?}", emission_counts);
  println!("\nInitial state counts:\n{:?}", initial_counts);

  // Normalize to get probabilities
  println!("\n--- Normalizing to probabilities ---");

  let transition_matrix = normalize_arr2(&transition_counts);
  println!("Transition matrix (A):\n{:?}", transition_matrix);

  let emission_matrix = normalize_arr2(&emission_counts);
  println!("\nEmission matrix (B):\n{:?}", emission_matrix);

  let initial_sum = initial_counts.sum();
  let initial_probs = if initial_sum > 0.0 {
    &initial_counts / initial_sum
  } else {
    Array1::from_elem(n_states, 1.0 / n_states as f64)
  };
  println!("\nInitial probabilities (π):\n{:?}", initial_probs);

  println!("\n=== MLE Training Complete ===\n");

  HmmWeights {
    transition: transition_matrix,
    emission: emission_matrix,
    initial_probs,
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  use hmmm::HMM;
  use ndarray::Array1;
  use std::path::PathBuf;

  use crate::{
    dataset::{apply_prediction_to_events, load_dataset},
    observation::{move_to_deltas, parse_datetime_or_panic, Observation},
    state::State,
    training::train_mle,
  };

  #[test]
  // TODO: old experimts
  fn test_run_hidden_markov_model() {
    let mut all_events = load_dataset(&PathBuf::from("./dataset/events_seed_1.csv"));
    all_events.sort_by_key(|e| e.t.clone());

    let timestamps: Vec<_> = all_events
      .iter()
      .map(|e| parse_datetime_or_panic(&e.t))
      .collect();

    let deltas = move_to_deltas(&timestamps);
    let mut states: Vec<State> = all_events
      .into_iter()
      .map(|e| State::from(e.state))
      .collect();
    states.remove(0);

    let mut training_data =
      HMMTrainingData::new(State::iter().count(), Observation::iter().count());

    training_data.add_delta_sequence(deltas, states);

    let weights = train_mle(&training_data);

    {
      let model = HMM::new(weights.transition, weights.emission, weights.initial_probs);
      let test_dataset = load_dataset(&PathBuf::from("./dataset/events_seed_2.csv"));
      let timestamps: Vec<_> = test_dataset
        .iter()
        .map(|e| parse_datetime_or_panic(&e.t))
        .collect();

      let deltas = move_to_deltas(&timestamps);
      let opbs: Vec<usize> = deltas_to_observations(deltas)
        .iter()
        .map(|o| o.as_index())
        .collect();

      let d = Array1::from(opbs);
      let prediction = model.most_likely_sequence(&d);
      println!("prediction {}", prediction);

      let predicted_states: Vec<usize> = prediction.to_vec();

      let predicted_events = apply_prediction_to_events(&test_dataset, &predicted_states);
    }
  }

  #[test]
  fn test_training_data_builder() {
    let mut training_data = HMMTrainingData::new(2, 6);

    let deltas1 = vec![2, 3, 5, 1, 4];
    let states = vec![State::Inside];
    training_data.add_delta_sequence(deltas1, states);

    training_data.debug_print();

    assert_eq!(training_data.num_sequences(), 1);
    assert!(training_data.total_observations() > 0);
  }

  #[test]
  fn test_train_mle() {
    let mut training_data = HMMTrainingData::new(2, 6);

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

    let HmmWeights {
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

    let mut training_data = HMMTrainingData::new(2, 3);

    // Manually add simple sequences
    // Sequence 1: State 0 → State 0 → State 1
    //             Obs   0 → Obs   1 → Obs   2
    training_data.add_sequence(vec![0, 0, 1], vec![0, 1, 2]);

    // Sequence 2: State 0 → State 1 → State 1
    //             Obs   0 → Obs   2 → Obs   2
    training_data.add_sequence(vec![0, 1, 1], vec![0, 2, 2]);

    training_data.debug_print();

    let HmmWeights {
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
