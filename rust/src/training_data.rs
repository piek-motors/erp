use crate::{observation::deltas_to_observations, state::State};

pub struct TrainingData {
  pub state_seq: Vec<Vec<usize>>,
  pub observation_seq: Vec<Vec<usize>>,
  pub n_states: usize,
  pub n_observations: usize,
}

impl TrainingData {
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
