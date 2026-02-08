use std::error::Error;

use napi_derive::napi;

use crate::{
  intervaling::{self, LabeledEvent},
  observation::{self, events_to_observations, suppress_bursts, Event},
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
    let events = suppress_bursts(events);

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

#[cfg(test)]
mod tests {
  use super::*;
  use crate::dataset;
  use std::path::PathBuf;

  #[test]
  fn test_infer_work_intervals_from_dataset_file() {
    let dataset_path = PathBuf::from("./dataset/1-2026_8170321.tsv");
    let labeled_events = dataset::load_dataset(&dataset_path);

    let events: Vec<Event> = labeled_events
      .iter()
      .map(|labeled| {
        // Convert Unix timestamp back to RFC2822 format for parsing
        if let Some(dt) = time::parse_unix(labeled.t) {
          Event {
            id: labeled.id,
            card: "unknown".to_string(),
            timestamp: dt.to_rfc2822(),
          }
        } else {
          panic!("Invalid timestamp");
        }
      })
      .collect();

    let result = infer_work_intervals(&events);

    assert!(result.is_ok(), "Inference should succeed");
    let shifts = result.unwrap();
    assert!(!shifts.is_empty(), "Should have at least one employee");

    if let Some(employee) = shifts.first() {
      println!("Employee: {}", employee.card);
      let mut current_date = String::new();
      for shift in &employee.shifts {
        let entry_date = shift.entry.datetime.split('T').next().unwrap_or("");
        if entry_date != current_date {
          current_date = entry_date.to_string();
          println!("\n {}", current_date);
        }
        println!(
          "  -> {} (id: {})",
          &shift.entry.datetime[0..16],
          shift.entry.id
        );
        if let Some(exit) = &shift.exit {
          println!("  <- {} (id: {})", &exit.datetime[0..16], exit.id);
        } else {
          println!("  <-  (ongoing)");
        }
      }
    }
  }
}
