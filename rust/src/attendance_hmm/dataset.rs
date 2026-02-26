use std::{
  fs::{self},
  path::PathBuf,
};

use ndarray::Array2;
use rand::seq::SliceRandom as _;

use crate::utils::csv;

use super::{intervaling::LabeledEvent, observation::must_parse_timestamp, state::State};

const CSV_FIEL_DELIMITER: &str = "\t";

fn matrix_to_training_events(matrix: &Array2<String>) -> Vec<LabeledEvent> {
  let mut result = Vec::new();

  for row_idx in 1..matrix.nrows() {
    let t = matrix[[row_idx, 0]].clone();
    let state: usize = matrix[[row_idx, 1]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse state at row {}: {}", row_idx, e));
    let id: u32 = matrix[[row_idx, 2]]
      .parse()
      .unwrap_or_else(|e| panic!("Failed to parse id at row {}: {}", row_idx, e));

    result.push(LabeledEvent {
      id,
      t: must_parse_timestamp(&t),
      state: State::from(state),
    });
  }
  result
}

pub fn ls_dir() -> Result<Vec<PathBuf>, std::io::Error> {
  Ok(
    fs::read_dir("./dataset")?
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
  dataset
}

pub fn load_dataset(path: &PathBuf) -> Vec<LabeledEvent> {
  let lines = fs::read(path).unwrap_or_else(|e| panic!("cannot read seed file {e}"));
  let matrix =
    csv::parse(&lines, CSV_FIEL_DELIMITER, 2).unwrap_or_else(|e| panic!("cant load dataset: {e}"));
  matrix_to_training_events(&matrix)
}
