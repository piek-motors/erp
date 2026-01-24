#![deny(clippy::all)]

mod normalization;
mod observation_builder;
mod training;

use hmmm::HMM;
use napi_derive::napi;
use ndarray::{Array1, Array2};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

use crate::{
  normalization::normalize_arr2,
  observation_builder::{deltas_to_observations, move_to_deltas, Event},
};

/// These represent the “true” but unobserved status of an employee.
#[derive(EnumIter, PartialEq)]
pub enum State {
  /// Employee is currently at work
  Inside = 0,
  /// Employee is not at work
  Outside = 1,
}

impl Into<usize> for State {
  fn into(self) -> usize {
    State::iter().position(|o| o == self).unwrap()
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

/// Train an HMM using Maximum Likelihood Estimation from fully labeled sequences.
///
/// `states_seqs` is a slice of hidden state sequences (known labels)
/// `obs_seqs` is a slice of corresponding observation sequences.
/// `n` = number of hidden states
/// `k` = number of possible observations
///
/// Panics if lengths mismatch or sequences contain out-of-bounds values.
pub fn train_mle(states_seqs: &[Vec<usize>], obs_seqs: &[Vec<usize>], n: usize, k: usize) -> HMM {
  assert_eq!(states_seqs.len(), obs_seqs.len());

  let mut a_counts = Array2::<f64>::zeros((n, n));
  let mut b_counts = Array2::<f64>::zeros((n, k));
  let mut pi_counts = Array1::<f64>::zeros(n);

  for (states, obs) in states_seqs.iter().zip(obs_seqs.iter()) {
    assert_eq!(states.len(), obs.len());

    if let Some(&first_state) = states.first() {
      assert!(first_state < n, "state out of bounds");
      pi_counts[first_state] += 1.0;
    }

    for (i, &state) in states.iter().enumerate() {
      assert!(state < n, "state out of bounds");
      let observation = obs[i];
      assert!(observation < k, "observation out of bounds");
      b_counts[(state, observation)] += 1.0;

      // Count transitions (except for last element)
      if i + 1 < states.len() {
        let next_state = states[i + 1];
        a_counts[(state, next_state)] += 1.0;
      }
    }
  }

  let a = normalize_arr2(&a_counts);
  let b = normalize_arr2(&b_counts);

  let pi_sum: f64 = pi_counts.sum();
  let pi = if pi_sum > 0.0 {
    &pi_counts / pi_sum
  } else {
    Array1::from_elem(n, 1.0 / n as f64)
  };

  let h = HMM::new(a, b, pi);
  h
}

#[cfg(test)]
mod tests {
  use std::fs;

  use crate::observation_builder::delta_to_observation;

  use super::*;

  #[test]
  fn test_run_hidden_markov_model() {
    let events_json =
      fs::read("./events_seed.json").unwrap_or_else(|e| panic!("cannot read seed file {e}"));

    let events =
      serde_json::from_slice::<Vec<Event>>(&events_json).expect("fail to parse events seeds");

    run_hidden_markov_model(events);
  }

  #[test]
  fn test_train_mle() {
    let observations: Vec<usize> = deltas_to_observations(vec![2, 3, 20, 25, 1, 5, 40])
      .iter()
      .map(|f| f.as_index())
      .collect();

    let states: Vec<usize> = vec![State::Inside, State::Outside]
      .into_iter()
      .map(|state| state.into())
      .collect();

    // let hmm = train_employee_hmm(&deltas);
    // train_mle(&states, &observations, 2, 6);
  }
}
