#![deny(clippy::all)]

mod normalization;
mod observation_builder;
mod training;

use hmmm::HMM;
use napi_derive::napi;
use ndarray::{Array1, Array2};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

use crate::{
  normalization::normalize_arr2,
  observation_builder::{deltas_to_observations, move_to_deltas, Event},
};

/// These represent the “true” but unobserved status of an employee.
#[derive(Debug, EnumIter, PartialEq, Serialize, Deserialize)]
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

/// HMM solves the problem of deciding inside vs outside for each swipe by using the entire sequence context, not just individual time gaps.
#[napi]
pub fn run_hidden_markov_model(all_events: Vec<Event>) -> u32 {
  // 1. Group events by card
  let events_grouped = observation_builder::group(all_events);
  // 2. Run HMM for each user
  for (card, events) in events_grouped.iter() {
    if events.len() < 2 {
      // Need at least 2 events to calculate deltas
      continue;
    }

    // Convert events to observations
    let timestamps: Vec<_> = events.iter().map(|e| e.ts).collect();
    let deltas = move_to_deltas(&timestamps);
    let observations = deltas_to_observations(deltas);

    // if observations.len() < MIN_EVENTS_FOR_TRAINING {
    //   println!(
    //     "  Not enough data for training (need at least {})",
    //     MIN_EVENTS_FOR_TRAINING
    //   );
    //   continue;
    // }

    println!("Card {}: observations {:?}", card, observations);

    // Convert observations to indices
    let obs_indices: Vec<usize> = observations.iter().map(|obs| obs.as_index()).collect();

    println!("indices {:?}", obs_indices);
  }

  1
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TrainingEvent {
  pub id: u32,
  pub card: String,
  pub t: String,
  pub state: u8,
}

#[cfg(test)]
mod tests {
  use std::fs;

  use crate::{observation_builder::Observation, training::train_mle};

  use super::*;

  #[test]
  fn test_run_hidden_markov_model() {
    let events_json =
      fs::read("./events_seed.json").unwrap_or_else(|e| panic!("cannot read seed file {e}"));

    let all_events = serde_json::from_slice::<Vec<TrainingEvent>>(&events_json)
      .expect("fail to parse events seeds");

    let binding = observation_builder::group(
      all_events
        .iter()
        .clone()
        .map(|e| Event {
          id: e.id,
          card: e.card.clone(),
          timestamp: e.t.clone(),
        })
        .collect(),
    );
    let events_grouped = binding.get("10996559").unwrap();

    let timestamps: Vec<_> = events_grouped.iter().map(|e| e.ts).collect();
    let deltas = move_to_deltas(&timestamps);
    // let observations = deltas_to_observations(deltas);
    let mut states: Vec<State> = all_events
      .into_iter()
      .map(|e| State::from(e.state))
      .collect();

    states.remove(0);
    // let n_observations: Vec<usize> = deltas_to_observations(vec![2, 3, 20, 25, 1, 5, 40])
    //   .iter()
    //   .map(|f| f.as_index())
    //   .collect();

    // // let n_states: Vec<usize> = vec![State::Inside, State::Outside]
    // //   .into_iter()
    // //   .map(|state| state.into())
    // //   .collect();

    // println!("events {:?}", events);

    let mut train_params =
      training::HMMTrainingData::new(State::iter().count(), Observation::iter().count());

    train_params.add_delta_sequence(deltas, states);

    train_mle(&train_params);
  }
}
