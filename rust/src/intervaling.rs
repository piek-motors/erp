use std::collections::HashMap;

use napi_derive::napi;

use crate::{observation::EmployeeEvent, state::State};

#[derive(Debug)]
pub struct DailyEvents(HashMap<String, Vec<EmployeeEvent>>);

impl DailyEvents {
  pub fn new(events: Vec<EmployeeEvent>) -> Self {
    let mut r: HashMap<String, Vec<EmployeeEvent>> = HashMap::new();

    for ev in events {
      let date_string = parse_unix(ev.t)
        .expect("fail ot parse unix time")
        .to_rfc3339();
      let key = date_string
        .split("T")
        .nth(0)
        .unwrap_or("fail ot parse unix time");

      let v = r.entry(key.to_string()).or_insert_with(Vec::new);

      // deduplicate events
      v.retain(|e| e.t != ev.t);
      v.push(ev);
    }

    DailyEvents(r)
  }
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct IntervalEvent {
  pub id: u32,
  pub datetime: String,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct WorkInterval {
  pub entry: IntervalEvent,
  pub exit: Option<IntervalEvent>,
}

pub fn states_to_intervals(
  events: Vec<EmployeeEvent>, // E0..EN
  states: &[State],           // S0..S(N-1)
) -> Vec<WorkInterval> {
  assert!(
    events.len() == states.len() + 1,
    "Alignment violation: events = {}, states = {}",
    events.len(),
    states.len()
  );

  for idx in 1..events.len() {
    let ev = events.get(idx).unwrap();
    println!(
      "event {} - {}, {:?}",
      ev.id,
      unix_to_utc_iso(ev.t),
      State::from(states[idx - 1])
    );
  }

  let events_copy: Vec<EmployeeEvent> = events.iter().map(|e| (*e).clone()).collect();
  let day_clearvage = DailyEvents::new(events_copy);
  day_clearvage
    .0
    .iter()
    .for_each(|each| println!("e {:-?}", each.1));

  let mut intervals = Vec::new();
  let mut current_entry: Option<IntervalEvent> = None;

  for i in 0..states.len() {
    let start_event = &events[i];
    let end_event = &events[i + 1];

    match (states[i], &current_entry) {
      // Outside → Inside : ENTRY at E[i]
      (State::Inside, None) => {
        current_entry = Some(IntervalEvent {
          id: start_event.id,
          datetime: unix_to_utc_iso(start_event.t),
        });
      }

      // Inside → Outside : EXIT at E[i+1]
      (State::Outside, Some(entry)) => {
        intervals.push(WorkInterval {
          entry: entry.clone(),
          exit: Some(IntervalEvent {
            id: end_event.id,
            datetime: unix_to_utc_iso(end_event.t),
          }),
        });
        current_entry = None;
      }

      // Inside → Inside : continue
      (State::Inside, Some(_)) => {}

      // Outside → Outside : nothing
      (State::Outside, None) => {}
    }
  }

  // Still inside after last state → open-ended interval
  if let Some(entry) = current_entry {
    intervals.push(WorkInterval { entry, exit: None });
  }

  intervals
}

fn parse_unix(ts: i64) -> Option<chrono::DateTime<chrono::Utc>> {
  chrono::DateTime::<chrono::Utc>::from_timestamp(ts, 0)
}

fn unix_to_utc_iso(ts: i64) -> String {
  let dt = chrono::DateTime::<chrono::Utc>::from_timestamp(ts, 0).expect("invalid unix timestamp");
  dt.to_rfc3339()
}
