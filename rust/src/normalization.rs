use ndarray::{Array2, Axis};

/// Normalize a count matrix row-wise into probabilities.
///
/// Each row is converted into a probability distribution:
///   P(col | row)
///
/// If a row sums to zero (no observations),
/// a uniform distribution is used as a safe fallback.
///
/// # Arguments
/// - `counts`: matrix of raw counts [rows x cols]
///
/// # Returns
/// - Row-normalized probability matrix [rows x cols]
pub fn normalize_arr2(counts: &Array2<f64>) -> Array2<f64> {
  let cols = counts.ncols();
  let nrows = counts.nrows();

  let mut result = Array2::<f64>::zeros((nrows, cols));

  // Normalize each row
  for (i, row) in counts.axis_iter(Axis(0)).enumerate() {
    let sum = row.sum();
    if sum > 0.0 {
      // Normal case: MLE normalization
      for (j, &val) in row.iter().enumerate() {
        result[[i, j]] = val / sum;
      }
    } else {
      // Fallback: uniform distribution
      let uniform_val = 1.0 / cols as f64;
      for j in 0..cols {
        result[[i, j]] = uniform_val;
      }
    }
  }

  result
}

#[cfg(test)]
mod tests {
  use super::*;
  use ndarray::array;

  #[test]
  fn test_normalize_rows_with_uniform_fallback() {
    println!("\n=== Test: normalize_rows with uniform fallback ===");

    // 2 states, 3 possible next states
    let counts = array![
      [2.0, 1.0, 1.0], // sum = 4
      [0.0, 0.0, 0.0], // sum = 0 → fallback
    ];

    println!("Input counts:\n{:?}", counts);
    println!("Shape: {:?}", counts.shape());

    let result = normalize_arr2(&counts);

    println!("\nResult matrix:\n{:?}", result);
    println!("Result shape: {:?}", result.shape());

    // Extract rows for testing
    let row0 = result.row(0);
    let row1 = result.row(1);

    println!("\nRow 0: {:?}", row0);
    println!("Row 0 sum: {}", row0.sum());
    println!("Row 1: {:?}", row1);
    println!("Row 1 sum: {}", row1.sum());

    // Test row 0 normalization (2+1+1=4)
    assert!(
      (row0[0] - 0.5).abs() < 1e-9,
      "row0[0] should be 0.5, got {}",
      row0[0]
    );
    assert!(
      (row0[1] - 0.25).abs() < 1e-9,
      "row0[1] should be 0.25, got {}",
      row0[1]
    );
    assert!(
      (row0[2] - 0.25).abs() < 1e-9,
      "row0[2] should be 0.25, got {}",
      row0[2]
    );

    // Test row 1 uniform fallback
    assert!(
      (row1[0] - 1.0 / 3.0).abs() < 1e-9,
      "row1[0] should be 1/3, got {}",
      row1[0]
    );
    assert!(
      (row1[1] - 1.0 / 3.0).abs() < 1e-9,
      "row1[1] should be 1/3, got {}",
      row1[1]
    );
    assert!(
      (row1[2] - 1.0 / 3.0).abs() < 1e-9,
      "row1[2] should be 1/3, got {}",
      row1[2]
    );

    println!("\n✓ All assertions passed!");
  }

  #[test]
  fn test_all_zeros_matrix() {
    println!("\n=== Test: all zeros matrix ===");

    let counts = array![[0.0, 0.0, 0.0], [0.0, 0.0, 0.0],];

    println!("Input (all zeros):\n{:?}", counts);

    let result = normalize_arr2(&counts);

    println!("\nResult:\n{:?}", result);

    for i in 0..result.nrows() {
      let row = result.row(i);
      println!("Row {}: {:?}, sum: {}", i, row, row.sum());
      for j in 0..result.ncols() {
        assert!((row[j] - 1.0 / 3.0).abs() < 1e-9);
      }
    }

    println!("\n✓ All zeros test passed!");
  }

  #[test]
  fn test_normal_matrix() {
    println!("\n=== Test: normal matrix (no zeros) ===");

    let counts = array![
      [10.0, 20.0, 30.0], // sum = 60
      [5.0, 10.0, 15.0],  // sum = 30
    ];

    println!("Input counts:\n{:?}", counts);

    let result = normalize_arr2(&counts);

    println!("\nNormalized result:\n{:?}", result);

    // Check row 0
    let row0 = result.row(0);
    println!("\nRow 0: {:?}, sum: {}", row0, row0.sum());
    assert!(
      (row0[0] - 10.0 / 60.0).abs() < 1e-9,
      "Expected {}, got {}",
      10.0 / 60.0,
      row0[0]
    );
    assert!(
      (row0[1] - 20.0 / 60.0).abs() < 1e-9,
      "Expected {}, got {}",
      20.0 / 60.0,
      row0[1]
    );
    assert!(
      (row0[2] - 30.0 / 60.0).abs() < 1e-9,
      "Expected {}, got {}",
      30.0 / 60.0,
      row0[2]
    );
    assert!(
      (row0.sum() - 1.0).abs() < 1e-9,
      "Row sum should be 1.0, got {}",
      row0.sum()
    );

    // Check row 1
    let row1 = result.row(1);
    println!("Row 1: {:?}, sum: {}", row1, row1.sum());
    assert!(
      (row1[0] - 5.0 / 30.0).abs() < 1e-9,
      "Expected {}, got {}",
      5.0 / 30.0,
      row1[0]
    );
    assert!(
      (row1[1] - 10.0 / 30.0).abs() < 1e-9,
      "Expected {}, got {}",
      10.0 / 30.0,
      row1[1]
    );
    assert!(
      (row1[2] - 15.0 / 30.0).abs() < 1e-9,
      "Expected {}, got {}",
      15.0 / 30.0,
      row1[2]
    );
    assert!(
      (row1.sum() - 1.0).abs() < 1e-9,
      "Row sum should be 1.0, got {}",
      row1.sum()
    );

    println!("\n✓ Normal matrix test passed!");
  }

  #[test]
  fn test_single_row() {
    println!("\n=== Test: single row matrix ===");

    let counts = array![[3.0, 6.0, 9.0]]; // sum = 18

    println!("Input counts:\n{:?}", counts);

    let result = normalize_arr2(&counts);

    println!("\nNormalized result:\n{:?}", result);

    let row = result.row(0);
    println!("Row: {:?}, sum: {}", row, row.sum());

    assert!((row[0] - 3.0 / 18.0).abs() < 1e-9);
    assert!((row[1] - 6.0 / 18.0).abs() < 1e-9);
    assert!((row[2] - 9.0 / 18.0).abs() < 1e-9);
    assert!((row.sum() - 1.0).abs() < 1e-9);

    println!("\n✓ Single row test passed!");
  }
}
