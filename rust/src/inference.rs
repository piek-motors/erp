use crate::{
  intervaling::WorkInterval,
  observation::{self, deltas_to_observations, move_to_deltas, Event},
};

pub fn infer_work_intervals(
  events: &Vec<Event>,
) -> Result<Vec<WorkInterval>, Box<dyn std::error::Error>> {
  let events_grouped = observation::group_events(events);
  // 2. Run HMM for each user
  for (card, events) in events_grouped.iter() {
    if events.len() < 2 {
      // Need at least 2 events to calculate deltas
      continue;
    }

    // Convert events to observations
    let timestamps: Vec<_> = events.iter().map(|e| e.timestamp).collect();
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

  Ok(vec![])
}
