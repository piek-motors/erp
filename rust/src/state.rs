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

impl Into<usize> for State {
  fn into(self) -> usize {
    State::iter().position(|o| o == self).unwrap()
  }
}

impl From<u8> for State {
  fn from(value: u8) -> Self {
    match value {
      0 => State::Outside,
      1 => State::Inside,
      _ => panic!("invalid state ${}", value),
    }
  }
}
