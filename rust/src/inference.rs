use std::error::Error;

use napi_derive::napi;

use crate::{
  intervaling::{self, WorkInterval},
  observation::{self, events_to_observations, Event},
  state::State,
  training::Weights,
};

#[napi(object)]
#[derive(Debug, Clone)]
pub struct EmployeeWorkIntervals {
  pub card: String,
  pub intervals: Vec<WorkInterval>,
}

pub fn infer_work_intervals(
  events: &Vec<Event>,
) -> Result<Vec<EmployeeWorkIntervals>, Box<dyn Error>> {
  let events_grouped = observation::group_events(events);

  let model = Weights::load()?.into_model();
  let mut result: Vec<EmployeeWorkIntervals> = Vec::with_capacity(events_grouped.keys().len());

  for (card, events) in events_grouped.into_iter() {
    if events.len() < 2 {
      // Need at least 2 events to calculate deltas
      continue;
    }

    let observations = &events_to_observations(&events);
    let states = model
      .most_likely_sequence(observations)
      .iter()
      .map(|e| State::from(*e))
      .collect::<Vec<State>>();
    let work_intervals = intervaling::states_to_intervals(events, &states);

    result.push(EmployeeWorkIntervals {
      card: card.to_owned(),
      intervals: work_intervals,
    });
  }

  Ok(result)
}
