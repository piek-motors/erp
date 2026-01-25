use napi_derive::napi;

use crate::state::State;

#[napi(object)]
#[derive(Debug, Clone)]
pub struct WorkInterval {
  pub entry: i64,
  pub exit: Option<i64>,
}

pub fn states_to_intervals(
  timestamps: &[i64], // E0..EN
  states: &[State],   // S0..S(N-1)
) -> Vec<WorkInterval> {
  assert!(
    timestamps.len() == states.len() + 1,
    "Alignment violation: timestamps = {}, states = {}",
    timestamps.len(),
    states.len()
  );

  let mut intervals = Vec::new();
  let mut current_entry: Option<i64> = None;

  for i in 0..states.len() {
    let start = timestamps[i];

    match (states[i], current_entry) {
      // Outside → Inside : ENTRY
      (State::Inside, None) => {
        current_entry = Some(start);
      }

      // Inside → Outside : EXIT
      (State::Outside, Some(entry)) => {
        intervals.push(WorkInterval {
          entry,
          exit: Some(start),
        });
        current_entry = None;
      }

      // Inside → Inside : continue interval
      (State::Inside, Some(_)) => {
        // nothing to do
      }

      // Outside → Outside : nothing
      (State::Outside, None) => {
        // nothing to do
      }
    }

    // If this is the LAST interval and we are still inside,
    // close it with exit = None
    if i == states.len() - 1 {
      if let Some(entry) = current_entry {
        intervals.push(WorkInterval { entry, exit: None });
      }
    }
  }

  intervals
}
