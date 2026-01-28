use std::collections::HashMap;

use crate::{observation::TimeSeries, state::State, time};

const MAX_SHIFT_SECONDS: i64 = 12 * 60 * 60;

#[derive(Debug)]
pub struct DailyEvents<T>(HashMap<String, Vec<T>>);

impl<T> DailyEvents<T>
where
  T: TimeSeries,
{
  pub fn new(events: Vec<T>) -> Self {
    let mut r: HashMap<String, Vec<T>> = HashMap::new();

    for ev in events {
      let date_string = time::parse_unix(ev.timestamp())
        .expect("fail ot parse unix time")
        .to_rfc3339();
      let key = date_string
        .split("T")
        .nth(0)
        .unwrap_or("fail ot parse unix time");

      let v = r.entry(key.to_string()).or_insert_with(Vec::new);

      // deduplicate events
      v.retain(|e| e.timestamp() != ev.timestamp());
      v.push(ev);
    }

    DailyEvents(r)
  }

  pub fn iter(&self) -> std::collections::hash_map::Iter<'_, String, Vec<T>> {
    self.0.iter()
  }

  pub fn get_events_at_date(&self, date: &str) -> Option<&Vec<T>> {
    self.0.get(date)
  }
}

#[derive(Debug, Clone)]
pub struct LabeledEvent {
  pub id: u32,
  pub t: i64,
  pub state: State,
}

impl TimeSeries for LabeledEvent {
  fn timestamp(&self) -> i64 {
    self.t
  }
}

#[derive(Debug, Clone)]
pub struct IntervalEvent {
  pub id: u32,
  pub t: i64,
}

#[derive(Debug, Clone)]
pub struct Shift {
  pub entry: IntervalEvent,
  pub exit: Option<IntervalEvent>,
}

pub fn states_to_intervals(events: Vec<LabeledEvent>) -> Vec<Shift> {
  let mut intervals = Vec::new();
  let daily_events = DailyEvents::new(events);

  for (date, events) in daily_events.iter() {
    let next_date = time::get_next_date(date);
    let next_day_events = daily_events
      .get_events_at_date(&next_date)
      .map(|v| v.as_slice())
      .unwrap_or(&[]);

    intervals.extend(build_shifts_from_events(events, next_day_events));
  }

  intervals
}

fn build_shifts_from_events(
  events: &[LabeledEvent],
  next_day_events: &[LabeledEvent],
) -> Vec<Shift> {
  let mut intervals = Vec::new();

  enum FSM {
    Outside,
    Inside { entry: IntervalEvent },
  }

  let mut state = FSM::Outside;

  // 1. Process current-day events
  for ev in events {
    match (&state, ev.state) {
      (FSM::Outside, State::Inside) => {
        state = FSM::Inside {
          entry: IntervalEvent { id: ev.id, t: ev.t },
        };
      }

      (FSM::Inside { entry }, State::Outside) => {
        intervals.push(Shift {
          entry: entry.clone(),
          exit: Some(IntervalEvent { id: ev.id, t: ev.t }),
        });
        state = FSM::Outside;
      }

      _ => {}
    }
  }

  // 2. Overnight shifts: Attempt to close from event on next day
  if let FSM::Inside { entry } = state {
    let mut exit = None;

    match next_day_events.get(0) {
      Some(ev) => {
        if ev.state == State::Outside {
          let duration = ev.t - entry.t;

          if duration > 0 && duration <= MAX_SHIFT_SECONDS {
            exit = Some(IntervalEvent { id: ev.id, t: ev.t });
          }
        }
      }
      None => {}
    };

    intervals.push(Shift { entry, exit });
  }

  intervals
}

#[cfg(test)]
mod tests {
  use crate::iso;

  use super::*;

  fn ev(id: u32, t: i64, state: State) -> LabeledEvent {
    LabeledEvent { id, t, state }
  }

  #[test]
  fn simple_entry_exit() {
    let events = vec![ev(1, 10, State::Inside), ev(2, 20, State::Outside)];

    let res = build_shifts_from_events(&events, &vec![]);
    assert_eq!(res.len(), 1);
    assert!(res[0].exit.is_some());
  }

  #[test]
  fn open_interval_at_end() {
    let events = vec![ev(1, 10, State::Inside)];

    let res = build_shifts_from_events(&events, &vec![]);
    assert_eq!(res.len(), 1);
    assert!(res[0].exit.is_none());
  }

  #[test]
  fn ignore_duplicate_states() {
    let events = vec![
      ev(1, 10, State::Outside),
      ev(2, 20, State::Outside),
      ev(3, 30, State::Inside),
      ev(4, 40, State::Inside),
      ev(5, 50, State::Outside),
    ];

    let res = build_shifts_from_events(&events, &vec![]);
    assert_eq!(res.len(), 1);
  }

  #[test]
  fn next_day_exit_within_12h_closes_shift() {
    let day1 = vec![ev(1, iso!("2026-01-28T22:00:00Z"), State::Inside)];
    let day2 = vec![ev(2, iso!("2026-01-29T06:00:00Z"), State::Outside)];

    let intervals = build_shifts_from_events(&day1, &day2);
    assert_eq!(intervals.len(), 1);

    let interval = &intervals[0];
    assert_eq!(interval.entry.id, 1);
    assert_eq!(interval.exit.as_ref().unwrap().id, 2);
  }

  #[test]
  fn next_day_exit_after_12h_does_not_close_shift() {
    let day1 = vec![ev(1, iso!("2026-01-28T22:00:00Z"), State::Inside)];
    let day2 = vec![ev(2, iso!("2026-01-29T22:00:00Z"), State::Outside)];

    let intervals = build_shifts_from_events(&day1, &day2);
    assert_eq!(intervals.len(), 1);

    let interval = &intervals[0];
    assert_eq!(interval.entry.id, 1);
    assert!(interval.exit.is_none()); // too far → open
  }
}
