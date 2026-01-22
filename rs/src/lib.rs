#![deny(clippy::all)]

mod observation_builder;

use napi_derive::napi;

use crate::observation_builder::{deltas_to_observations, move_to_deltas, Event};

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

#[napi]
pub fn run_hidden_markov_model(events: Vec<Event>) -> u32 {
  // 1. group events by card
  let events_grouped = observation_builder::group(events);

  for (_, events) in events_grouped.iter() {
    let timestamps: Vec<_> = events.iter().map(|e| e.ts).collect();
    let deltas = move_to_deltas(&timestamps);
    let observations = deltas_to_observations(deltas);
    println!("observations {:?}", observations);
  }

  // 2. run hmm for each user
  1
}
