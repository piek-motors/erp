use ndarray::Array2;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum CsvParseError {
  #[error("malformed utf-8 string passed")]
  MalformedUtf8,
  #[error("no data provided in the input vector")]
  NoData,
  #[error("privided input is not rectangular")]
  WrongShape(String),
  #[error("ndarray construction error")]
  ShapeError(#[from] ndarray::ShapeError),
}

pub fn parse(bytes: Vec<u8>) -> Result<Array2<String>, CsvParseError> {
  let text = str::from_utf8(&bytes).map_err(|_| CsvParseError::MalformedUtf8)?;

  // Split into rows, ignore empty trailing lines
  let rows: Vec<Vec<String>> = text
    .lines()
    .filter(|line| !line.trim().is_empty())
    .map(|line| {
      line
        .split(',')
        .map(|cell| cell.trim().to_string())
        .collect()
    })
    .collect();

  if rows.is_empty() {
    return Err(CsvParseError::NoData);
  }

  // Validate rectangular shape
  let nrows = rows.len();
  let ncols = rows[0].len();

  for (i, row) in rows.iter().enumerate() {
    if row.len() != ncols {
      return Err(CsvParseError::WrongShape(format!(
        "Row {} has {} columns, expected {}",
        i,
        row.len(),
        ncols
      )));
    }
  }

  // Flatten row-major into Array2
  let flat: Vec<String> = rows.into_iter().flatten().collect();
  Array2::from_shape_vec((nrows, ncols), flat).map_err(|e| CsvParseError::ShapeError(e))
}
