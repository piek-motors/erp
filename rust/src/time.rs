pub fn parse_unix(ts: i64) -> Option<chrono::DateTime<chrono::Utc>> {
  chrono::DateTime::<chrono::Utc>::from_timestamp(ts, 0)
}

pub fn unix_to_utc_iso(ts: i64) -> String {
  let dt = chrono::DateTime::<chrono::Utc>::from_timestamp(ts, 0).expect("invalid unix timestamp");
  dt.to_rfc3339()
}

pub fn get_next_date(d: &str) -> String {
  let date = chrono::NaiveDate::parse_from_str(d, "%Y-%m-%d").expect("invalid date format");
  let next_date = date.succ_opt().expect("date overflow");
  next_date.format("%Y-%m-%d").to_string()
}

/// Converts ISO8601 string literal to Unix timestamp in seconds
/// Example: iso!("2026-01-28T12:00:00Z") => 1762142400
#[macro_export]
macro_rules! iso {
  ($iso:literal) => {{
    chrono::DateTime::parse_from_rfc3339($iso)
      .expect("invalid ISO datetime")
      .timestamp()
  }};
}
