use std::{
  fs::{self},
  path::PathBuf,
};

use ndarray::Array2;
use rand::seq::SliceRandom as _;

use crate::{
  csv,
  observation::{must_parse_timestamp, TimeSeries},
  state::State,
};

const CSV_FIEL_DELIMITER: &str = "\t";

#[derive(Debug, Clone)]
pub struct TrainingEvent {
  pub id: u32,
  // pub card: String,
  pub t: i64,
  pub state: State,
}

impl TimeSeries for TrainingEvent {
  fn timestamp(&self) -> i64 {
    self.t
  }
}

fn matrix_to_training_events(matrix: &Array2<String>) -> Vec<TrainingEvent> {
  let mut result = Vec::new();

  for row_idx in 1..matrix.nrows() {
    let t = matrix[[row_idx, 0]].clone();
    let state: usize = matrix[[row_idx, 1]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse state at row {}: {}", row_idx, e));
    let id: u32 = matrix[[row_idx, 2]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse id at row {}: {}", row_idx, e));

    result.push(TrainingEvent {
      id,
      // card: card.to_owned(),
      t: must_parse_timestamp(&t),
      state: State::from(state),
    });
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

pub struct Dataset<T> {
  pub train: Vec<T>,
  pub test: Vec<T>,
}

pub fn split_dataset<T: Clone>(dataset: Vec<T>, test_ratio: f64) -> Dataset<T> {
  let mut rng = rand::thread_rng();
  let mut data = dataset.clone();
  data.shuffle(&mut rng); // shuffle the dataset randomly

  let test_size = (data.len() as f64 * test_ratio).round() as usize;
  let dataset = Dataset {
    train: data[test_size..].to_vec(),
    test: data[..test_size].to_vec(),
  };

  assert_ne!(dataset.train.len(), 0, "no data for training");
  assert_ne!(dataset.test.len(), 0, "no data for test");
  dataset
}

pub fn load_dataset(path: &PathBuf) -> Vec<TrainingEvent> {
  let lines = fs::read(&path).unwrap_or_else(|e| panic!("cannot read seed file {e}"));
  let matrix =
    csv::parse(&lines, CSV_FIEL_DELIMITER, 2).unwrap_or_else(|e| panic!("cant load dataset: {e}"));

  // Extract the card name from the file name
  // let card = path
  //   .file_name()
  //   .and_then(|c| c.to_str())
  //   .map(|s| s.split('_').nth(1).unwrap_or("").to_string())
  //   .unwrap_or_else(|| panic!("dataset filename is None"));

  matrix_to_training_events(&matrix)
}

pub fn _align_predictions_with_events(
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
  first.state = State::Outside;
  result.push(first);

  // Remaining events get predicted states
  for (event, &state_idx) in events[1..].iter().zip(predicted_states.iter()) {
    let mut ev = event.clone();
    ev.state = State::from(state_idx);
    result.push(ev);
  }

  result
}
