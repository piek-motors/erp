#![deny(clippy::all)]

mod dataset;
mod inference;
mod intervaling;
mod normalization;
mod observation;
mod state;
mod training;
mod training_data;

use napi_derive::napi;

use crate::attendance_hmm::{
  inference::{infer_work_intervals, EmployeeShifts},
  observation::Event,
  training::train_hmm,
};

#[napi]
pub fn run_hidden_markov_model(events: Vec<Event>) -> Result<Vec<EmployeeShifts>, napi::Error> {
  infer_work_intervals(&events).map_err(|e| napi::Error::new(napi::Status::GenericFailure, e))
}

#[napi]
pub fn train_hidden_markov_model() -> Result<(), napi::Error> {
  train_hmm(0.3).map_err(|e| napi::Error::new(napi::Status::GenericFailure, e))
}
