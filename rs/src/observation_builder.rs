use std::{collections::HashMap, str::FromStr};

use chrono::Utc;
use napi_derive::napi;

#[napi(object)]
#[derive(Debug)]
pub struct Event {
  pub id: u32,
  pub card: String,
  pub timestamp: String,
}

pub struct UserEvent {
  pub id: u32,
  pub ts: i64,
}

type GroupedEvents = HashMap<String, Vec<UserEvent>>;

pub fn group(events: Vec<Event>) -> GroupedEvents {
  let mut result: GroupedEvents = HashMap::new();

  for ev in events {
    let user_event = UserEvent {
      id: ev.id,
      ts: chrono::DateTime::<Utc>::from_str(&ev.timestamp)
        .unwrap_or_else(|_| panic!("can't parse event timestamp {:?}", ev))
        .timestamp(),
    };

    result
      .entry(ev.card)
      .or_insert_with(Vec::new)
      .push(user_event);
  }

  // Sort each user's events by datetime
  for events in result.values_mut() {
    events.sort_by_key(|e| e.ts);
  }

  result
}

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

#[derive(Debug, PartialEq)]
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

const MINUTE: u32 = 60;

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

    let groups = group(events);
    assert_eq!(groups.values().len(), 2);

    for (card, expected_hours) in cases {
      let usr_events = groups
        .get(card)
        .unwrap_or_else(|| panic!("missing card {card}"));
      let timestamps: Vec<_> = usr_events.iter().map(|e| e.ts).collect();
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
