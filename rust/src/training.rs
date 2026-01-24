use ndarray::{Array1, Array2};

use crate::{normalization::normalize_arr2, observation_builder::deltas_to_observations, State};

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
pub fn train_mle(training_data: &HMMTrainingData) -> (Array2<f64>, Array2<f64>, Array1<f64>) {
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

  (transition_matrix, emission_matrix, initial_probs)
}

#[cfg(test)]
mod tests {
  use super::*;

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

    // Train the HMM
    let (a, b, pi) = train_mle(&training_data);

    println!("\n--- Final HMM Parameters ---");
    println!("A (transition matrix):");
    for i in 0..a.nrows() {
      println!("  State {} → {:?}", i, a.row(i));
    }

    println!("\nB (emission matrix):");
    for i in 0..b.nrows() {
      println!("  State {} → {:?}", i, b.row(i));
    }

    println!("\nπ (initial probabilities): {:?}", pi);

    // Verify probabilities sum to 1
    for i in 0..a.nrows() {
      let row_sum = a.row(i).sum();
      assert!(
        (row_sum - 1.0).abs() < 1e-6,
        "Transition matrix row {} should sum to 1.0, got {}",
        i,
        row_sum
      );
    }

    for i in 0..b.nrows() {
      let row_sum = b.row(i).sum();
      assert!(
        (row_sum - 1.0).abs() < 1e-6,
        "Emission matrix row {} should sum to 1.0, got {}",
        i,
        row_sum
      );
    }

    let pi_sum = pi.sum();
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

    let (a, b, pi) = train_mle(&training_data);

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
    println!("π: {:?}", pi);
    println!("A:\n{:?}", a);
    println!("B:\n{:?}", b);

    println!("\n✓ Simple MLE test complete!");
  }
}
