#![deny(clippy::all)]

mod csv;
mod dataset;
mod inference;
mod intervaling;
mod normalization;
mod observation;
mod state;
mod training;
use napi_derive::napi;

use crate::{
  inference::infer_work_intervals, intervaling::WorkInterval, observation::Event,
  training::train_hmm,
};

#[napi]
pub fn run_hidden_markov_model(events: Vec<Event>) -> Result<Vec<WorkInterval>, napi::Error> {
  infer_work_intervals(&events).map_err(|e| napi::Error::new(napi::Status::GenericFailure, e))
}

#[napi]
pub fn train_hidden_markov_model() -> Result<(), napi::Error> {
  train_hmm().map_err(|e| napi::Error::new(napi::Status::GenericFailure, e))
}
