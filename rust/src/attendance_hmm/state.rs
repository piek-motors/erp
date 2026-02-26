use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

/// These represent the “true” but unobserved status of an employee.
#[derive(Debug, EnumIter, PartialEq, Serialize, Deserialize, Clone, Copy)]
pub enum State {
  /// Employee is not at work
  Outside = 0,
  /// Employee is currently at work
  Inside = 1,
}

impl From<State> for usize {
  fn from(val: State) -> Self {
    State::iter().position(|o| o == val).unwrap()
  }
}

impl From<usize> for State {
  fn from(value: usize) -> Self {
    match value {
      0 => State::Outside,
      1 => State::Inside,
      _ => panic!("invalid state ${}", value),
    }
  }
}
