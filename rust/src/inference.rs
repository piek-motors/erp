use std::error::Error;

use crate::{
  intervaling::WorkInterval,
  observation::{self, events_to_observations, Event},
  training::Weights,
};

pub fn infer_work_intervals(events: &Vec<Event>) -> Result<Vec<WorkInterval>, Box<dyn Error>> {
  let events_grouped = observation::group_events(events);
  // 2. Run HMM for each user

  let weights = Weights::load()?;
  let model = weights.create_model();

  for (card, events) in events_grouped.iter() {
    if events.len() < 2 {
      // Need at least 2 events to calculate deltas
      continue;
    }

    let states = model.most_likely_sequence(&events_to_observations(events));
  }

  Ok(vec![])
}
