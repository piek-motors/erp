use std::error::Error;

use napi_derive::napi;

use crate::{
  intervaling::{self, LabeledEvent},
  observation::{self, events_to_observations, Event},
  state::State,
  time,
  training::Weights,
};

#[napi(object)]
#[derive(Debug, Clone)]
pub struct ShiftEvent {
  pub id: u32,
  pub datetime: String,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct Shift {
  pub entry: ShiftEvent,
  pub exit: Option<ShiftEvent>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct EmployeeShifts {
  pub card: String,
  pub shifts: Vec<Shift>,
}

pub fn infer_work_intervals(events: &Vec<Event>) -> Result<Vec<EmployeeShifts>, Box<dyn Error>> {
  let events_grouped = observation::group_events(events);

  let model = Weights::load()?.into_model();
  let mut result: Vec<EmployeeShifts> = Vec::with_capacity(events_grouped.keys().len());

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

    assert!(
      events.len() == states.len() + 1,
      "Alignment violation: events = {}, states = {}",
      events.len(),
      states.len()
    );

    let merged_events: Vec<LabeledEvent> = events
      .iter()
      .skip(1)
      .zip(states.iter())
      .map(|(e, s)| LabeledEvent {
        id: e.id,
        t: e.t,
        state: *s,
      })
      .collect();

    let mut shifts = intervaling::states_to_intervals(merged_events);
    shifts.sort_by_key(|k| k.entry.t);

    result.push(EmployeeShifts {
      card: card.to_owned(),
      shifts: shifts
        .iter()
        .map(|each| Shift {
          entry: ShiftEvent {
            id: each.entry.id,
            datetime: time::unix_to_utc_iso(each.entry.t),
          },
          exit: each.exit.as_ref().map(|e| ShiftEvent {
            id: e.id,
            datetime: time::unix_to_utc_iso(e.t),
          }),
        })
        .collect(),
    });
  }

  Ok(result)
}
