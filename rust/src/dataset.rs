use std::{
  fs::{self},
  path::PathBuf,
};

use ndarray::Array2;
use serde::{Deserialize, Serialize};

use crate::{csv, state::State};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TrainingEvent {
  pub id: u32,
  pub card: String,
  pub t: String,
  pub state: u8,
}

fn matrix_to_training_events(matrix: &Array2<String>) -> Vec<TrainingEvent> {
  let mut result = Vec::new();
  for row_idx in 1..matrix.nrows() {
    let t = matrix[[row_idx, 0]].clone();
    let state: u8 = matrix[[row_idx, 1]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse state at row {}: {}", row_idx, e));
    let id: u32 = matrix[[row_idx, 2]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse id at row {}: {}", row_idx, e));
    let card = matrix[[row_idx, 3]].clone();
    result.push(TrainingEvent { id, card, t, state });
  }
  result
}

pub fn ls_dir() -> Result<Vec<PathBuf>, std::io::Error> {
  Ok(
    fs::read_dir("./dataset")?
      .into_iter()
      .map(|dir_entry| match dir_entry {
        Ok(f) => f.path().to_path_buf(),
        Err(e) => panic!("fail to list dataset dir: {}", e),
      })
      .collect::<Vec<PathBuf>>(),
  )
}

pub fn load_dataset(path: &PathBuf) -> Vec<TrainingEvent> {
  let lines = fs::read(&path).unwrap_or_else(|e| panic!("cannot read seed file {e}"));
  let matrix = csv::parse(lines.clone()).unwrap_or_else(|e| panic!("cant load dataset: {e}"));
  matrix_to_training_events(&matrix)
}

pub fn apply_prediction_to_events(
  events: &[TrainingEvent],
  predicted_states: &[usize],
) -> Vec<TrainingEvent> {
  assert!(
    events.len() == predicted_states.len() + 1,
    "events.len() must be predicted_states.len() + 1"
  );
  let mut result = Vec::with_capacity(events.len());
  // First event has no delta → no prediction
  let mut first = events[0].clone();
  // Convention: Outside (or keep original if you prefer)
  first.state = State::Outside as u8;
  result.push(first);

  // Remaining events get predicted states
  for (event, &state_idx) in events[1..].iter().zip(predicted_states.iter()) {
    let mut ev = event.clone();
    ev.state = state_idx as u8;
    result.push(ev);
  }

  result
}
