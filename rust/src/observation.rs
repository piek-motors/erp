use std::{collections::HashMap, str::FromStr};

use chrono::{FixedOffset, Utc};
use napi_derive::napi;
use serde::Deserialize;
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

/// The events we actually observe in the system.
///
/// Important:
/// - Events are instantaneous points in time (badge swipes).
/// - They do not describe duration or state by themselves.
///
/// From events we derive *time intervals* (deltas),
/// and only those intervals can meaningfully be associated with
/// a hidden state such as "Inside" or "Outside"
#[napi(object)]
#[derive(Debug, Deserialize)]
pub struct Event {
  pub id: u32,
  pub card: String,
  pub timestamp: String,
}

/// Internal representation after grouping and parsing timestamps.
pub struct UserEvent {
  pub id: u32,
  pub timestamp: i64,
}

/// Parse ISO-8601 timestamp into UNIX seconds.
///
/// Panics if parsing fails — timestamps are assumed to be validated upstream.
pub fn parse_iso_datetime_or_panic(ts: &str) -> i64 {
  chrono::DateTime::<FixedOffset>::parse_from_rfc2822(ts)
    .unwrap_or_else(|_| panic!("can't parse timestamp {}", ts))
    .timestamp()
}

/// Events grouped by card (user).
/// Each vector is sorted by timestamp before further processing.
type GroupedUserEvents = HashMap<String, Vec<UserEvent>>;

/// Group events by card and sort them by time.
///
/// After this step:
/// - Each user's events are in strict chronological order.
/// - This ordering is REQUIRED for correct delta computation.
///
/// No modeling decisions happen here — this is pure preprocessing.
pub fn group_events(events: &Vec<Event>) -> GroupedUserEvents {
  let mut result: GroupedUserEvents = HashMap::new();

  for ev in events {
    let user_event = UserEvent {
      id: ev.id,
      timestamp: parse_iso_datetime_or_panic(&ev.timestamp),
    };

    result
      .entry(ev.card.clone())
      .or_insert_with(Vec::new)
      .push(user_event);
  }

  for events in result.values_mut() {
    events.sort_by_key(|e| e.timestamp);
  }

  result
}

/// Convert a sequence of event timestamps into time deltas in seconds.
///
/// ### Alignment
///
/// Given N events:
///
///   `E0, E1, E2, ..., E(N-1)`
///
/// we compute `N-1` deltas:
///
///   `Δ1 = E1 - E0, Δ2 = E2 - E1, ...`
///
/// Each delta represents the *time interval between two consecutive events*.
///
/// **There is no delta before the first event.**
///
/// Later in the HMM:
/// - Each delta corresponds to exactly ONE hidden state.
/// - That state describes the employee status DURING the interval:
///
///   `state[i]` describes the interval `(E[i-1] → E[i])`
///
/// This is why:
/// - Number of deltas = number of states
/// - The first event has no associated state
pub fn move_to_deltas(events: &Vec<i64>) -> Vec<u32> {
  let mut deltas: Vec<u32> = Vec::new();

  for i in 1..events.len() {
    let delta = events[i] - events[i - 1];
    let delta_u32 = delta
      .try_into()
      .unwrap_or_else(|_| panic!("Negative or too large delta at index {}: {}", i, delta));

    deltas.push(delta_u32);
  }

  deltas
}

/// Discrete observation buckets derived from time deltas.
///
/// Observations do NOT represent events.
/// They represent *duration patterns* between events.
#[derive(Debug, PartialEq, EnumIter)]
pub enum Observation {
  /// [0; 5m)
  VeryShort,
  /// [5m; 1h)
  Short,
  /// [1h; 4h)
  Medium,
  /// [4h; 12h)
  Shift,
  /// [12h; 24h)
  Long,
  /// [24h; _)
  VeryLong,
}

impl Observation {
  pub fn as_index(&self) -> usize {
    Observation::iter().position(|o| o == *self).unwrap()
  }
}

impl Into<usize> for Observation {
  fn into(self) -> usize {
    Observation::iter().position(|o| o == self).unwrap()
  }
}

const MINUTE: u32 = 60;

/// Delta discretization to encounter observaiton bucket.
pub fn delta_to_observation(delta_sec: u32) -> Observation {
  match delta_sec {
    d if d < 5 * MINUTE => Observation::VeryShort,
    d if d < 60 * MINUTE => Observation::Short,
    d if d < 240 * MINUTE => Observation::Medium,
    d if d < 720 * MINUTE => Observation::Shift,
    d if d < 1440 * MINUTE => Observation::Long,
    _ => Observation::VeryLong,
  }
}

/// Convert deltas into observations.
///
/// Alignment reminder:
/// - observations[i] corresponds to delta[i]
/// - delta[i] corresponds to interval (E[i] → E[i+1])
/// - later: hidden_state[i] describes the SAME interval
///
/// This keeps the entire pipeline aligned:
///
/// events → deltas → observations → hidden states
pub fn deltas_to_observations(delta_sec: Vec<u32>) -> Vec<Observation> {
  delta_sec
    .into_iter()
    .map(|d| delta_to_observation(d))
    .collect()
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_parse_datetime_or_panic() {
    parse_iso_datetime_or_panic("Fri, 05 Dec 2025 14:18:52 GMT");
  }

  #[test]
  fn test_group_and_move_to_deltas() {
    let events: Vec<Event> = vec![
      Event {
        id: 1,
        card: "1".to_string(),
        timestamp: "2025-09-26T09:00:00.000Z".to_string(),
      },
      Event {
        id: 2,
        card: "2".to_string(),
        timestamp: "2025-09-26T10:00:00.000Z".to_string(),
      },
      Event {
        id: 3,
        card: "1".to_string(),
        timestamp: "2025-09-26T19:00:00.000Z".to_string(),
      },
      Event {
        id: 4,
        card: "2".to_string(),
        timestamp: "2025-09-26T21:00:00.000Z".to_string(),
      },
      Event {
        id: 5,
        card: "1".to_string(),
        timestamp: "2025-09-27T09:00:00.000Z".to_string(),
      },
      Event {
        id: 6,
        card: "1".to_string(),
        timestamp: "2025-09-27T15:00:00.000Z".to_string(),
      },
    ];

    let cases = vec![("1", vec![10, 14, 6]), ("2", vec![11])];
    let groups = group_events(&events);
    assert_eq!(groups.values().len(), 2);

    for (card, expected_hours) in cases {
      let usr_events = groups
        .get(card)
        .unwrap_or_else(|| panic!("missing card {card}"));
      let timestamps: Vec<_> = usr_events.iter().map(|e| e.timestamp).collect();
      let got = move_to_deltas(&timestamps);
      let expected: Vec<_> = expected_hours
        .clone()
        .into_iter()
        .map(|h| h * 3600)
        .collect();

      assert_eq!(
        got,
        expected,
        "card {card}: expected {expected_hours:?} h, got {:?}",
        got.iter().map(|&d| d / 3600).collect::<Vec<_>>()
      )
    }
  }

  #[test]
  fn test_delta_to_observation() {
    assert_eq!(delta_to_observation(60), Observation::VeryShort);
    assert_eq!(delta_to_observation(5 * 60), Observation::Short);
    assert_eq!(delta_to_observation(60 * 60 - 1), Observation::Short);
    assert_eq!(delta_to_observation(60 * 60), Observation::Medium);
    assert_eq!(delta_to_observation(24 * 60 * 60 - 1), Observation::Long);
  }
}
