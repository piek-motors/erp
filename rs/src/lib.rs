#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn plus_100(input: u32) -> u32 {
  input + 100
}

/// These represent the “true” but unobserved status of an employee.
pub enum State {
  /// On shift,
  Inside,
  /// Not on shift
  Outside,
  /// Uncertain state
  Unknown,
}

#[napi(object)]
pub struct Event {
  pub id: u32,
  pub card: String,
  pub timestamp: String,
}

#[napi]
pub fn run_hidden_markov_model(events: Vec<Event>) -> u32 {
  1
}
