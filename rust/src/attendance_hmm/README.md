# Attendance HMM - Hidden Markov Model for Employee Attendance Tracking

## Overview

This system uses a **Hidden Markov Model (HMM)** to automatically detect work shifts from employee badge swipe events. Instead of manually pairing entry/exit events, the HMM learns patterns from historical data and infers when employees are working.

## The Problem

Employee attendance systems record badge swipes (entry/exit events), but these raw events don't directly tell us:
- When did a work shift start and end?
- Which entry event pairs with which exit event?
- Was this person actually working, or just passing through?

Traditional rule-based approaches struggle with:
- Overnight shifts (entry at 22:00, exit at 06:00 next day)
- Multiple entries/exits in a day
- Irregular patterns (late arrivals, early departures)
- Missing swipes

## The HMM Solution

The HMM treats "being at work" as a **hidden state** that we can't directly observe. Instead, we observe **time intervals** between badge swipes and infer the hidden state sequence.

### Key Insight

```
┌─────────────────────────────────────────────────────────────┐
│  Hidden States (not directly observable)                    │
│  - Outside: Employee is NOT at work                         │
│  - Inside:  Employee IS at work                             │
└─────────────────────────────────────────────────────────────┘
                          ↓ emits
┌─────────────────────────────────────────────────────────────┐
│  Observations (what we can measure)                         │
│  - Time deltas between consecutive badge swipes             │
│  - Bucketed into: VeryShort, Short, Medium, Shift, Long...  │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

### Data Flow

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Raw Events   │ ──→ │ Preprocess  │ ──→ │ HMM Model   │ ──→ │ Shifts      │
│ (badge swipes)│     │ (deltas)    │     │ (inference) │     │ (intervals) │
└──────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
     │                    │                     │                    │
     │ 06:36 Entry        │ 9h delta            │ Inside state       │ 06:36 → 15:30
     │ 15:30 Exit         │ 15h delta           │ Outside state      │ (work shift)
     │ 06:36 Entry        │ 9h delta            │ Inside state       │
     └────────────────────┴─────────────────────┴────────────────────┘
```

### Observation Buckets

Time deltas are categorized into 6 buckets:

| Bucket | Duration | Typical Meaning |
|--------|----------|-----------------|
| VeryShort | < 5 min | Re-entry, tailgating |
| Short | 5 min - 1 hour | Break, meeting |
| Medium | 1 - 4 hours | Partial shift, meeting |
| **Shift** | **4 - 12 hours** | **Normal work day** |
| Long | 12 - 24 hours | Overnight gap |
| VeryLong | > 24 hours | Weekend, vacation |

### Model Components

#### 1. Transition Matrix (A)
Probability of moving between states:

```
            To: Outside   Inside
From Outside    0.04       0.96
     Inside     0.82       0.18
```

**Interpretation:**
- If outside → 96% chance next state is Inside (coming to work)
- If inside → 82% chance next state is Outside (leaving work)

#### 2. Emission Matrix (B)
Probability of observing a time delta given a state:

```
                    Observation Buckets
State      VeryShort  Short  Medium  Shift   Long   VeryLong
Outside       5%       0%      1%      1%     76%      18%
Inside        5%       1%      1%      80%     6%       7%
```

**Key insight:** `emission[Inside][Shift] = 80%` means:
> "When an employee is at work (Inside), there's an 80% chance the time until their next swipe will be 4-12 hours (a normal shift)"

#### 3. Initial Probabilities (π)
Starting state distribution:
- P(Outside) = 0%
- P(Inside) = 100%

(Assumes first event of the day is arrival)

## Architecture

```
rust/
├── src/attendance_hmm/
│   ├── mod.rs              # N-API bindings for TypeScript
│   ├── inference.rs        # Run inference on new events
│   ├── training.rs         # Train model from labeled data
│   ├── dataset.rs          # Load TSV datasets
│   ├── observation.rs      # Convert events to observations
│   ├── state.rs            # Inside/Outside state enum
│   ├── intervaling.rs      # Convert states to shift intervals
│   ├── normalization.rs    # Normalize probability matrices
│   └── training_data.rs    # Training data structure
├── dataset/                # Training data (TSV files)
└── weights.json            # Trained model parameters
```

## Training Process

### Input: Labeled Datasets

Each dataset is a TSV file with labeled events:

```tsv
Валерий	Григорьев
timestamp	state	id

Wed, 04 Feb 2026 06:41:36 GMT	1	1005286   ← Entry (Inside)
Wed, 04 Feb 2026 15:30:26 GMT	0	1005399   ← Exit (Outside)
Thu, 05 Feb 2026 06:36:18 GMT	1	1005424   ← Entry (Inside)
Thu, 05 Feb 2026 15:31:00 GMT	0	1131361   ← Exit (Outside)
```

- `state=1` → Inside (entry event)
- `state=0` → Outside (exit event)

### Training Algorithm: Maximum Likelihood Estimation (MLE)

The model learns by counting:

1. **Transition counts:** How often does Outside→Inside occur?
2. **Emission counts:** What time deltas occur when Inside vs Outside?
3. **Normalize:** Convert counts to probabilities

```rust
// Key insight: Associate each delta with the state AT THE START of the interval
delta[0] = timestamps[1] - timestamps[0]  // 9 hours
state[0] = state of event[0]              // Inside (entry)

// Model learns: "9h delta during Inside state"
```

### Output: Trained Model

Saved to `weights.json`:
- Transition matrix (2×2)
- Emission matrix (2×6)
- Initial probabilities (2)

## Inference Process

### Input: Raw Events (No Labels!)

```typescript
{
  employee_id: 11,
  timestamp: "Wed, 04 Feb 2026 06:41:36 GMT",
  id: 1005286
}
```

### Steps

1. **Group by employee** and sort by time
2. **Compute deltas** between consecutive events
3. **Bucket deltas** into observations
4. **Viterbi algorithm** finds most likely state sequence
5. **Build intervals** from state transitions

### Output: Detected Shifts

```typescript
{
  employee_id: 11,
  shifts: [
    {
      entry: { datetime: "2026-02-04T06:41", id: 1005286 },
      exit:  { datetime: "2026-02-04T15:30", id: 1005399 }
    },
    // ... more shifts
  ]
}
```

## Known Bugs & Fixes

### Bug #1: First Data Row Skipped

**Symptom:** First event of each dataset was missing from training.

**Root Cause:** Double-skipping headers:
1. CSV parser skipped 2 header lines ✓
2. `matrix_to_training_events` started from `row_idx in 1..` ✗

**Fix:** Changed to `row_idx in 0..` to include all data rows.

**Impact:** 27 events loaded → 28 events loaded (all work days detected)

### Bug #2: State Alignment Inverted ⚠️

**Symptom:** Model learned backwards patterns. Only 3 of 14 work days detected.

**Root Cause:** Deltas were paired with wrong states:

```
Events: [E0:06:41(Inside), E1:15:30(Outside)]
Delta:  [D0 = 15:30 - 06:41 = 9 hours]

BEFORE (buggy):
  delta[0] (9h) → state[1] = Outside ❌
  Model learned: "9h work interval → Outside state"

AFTER (fixed):
  delta[0] (9h) → state[0] = Inside ✓
  Model learns: "9h work interval → Inside state"
```

**Fix:** Changed state alignment in both training and inference:

```rust
// Training
let states = events.iter().take(events.len() - 1).map(|e| e.state).collect();

// Inference
let merged = events.iter().take(events.len() - 1).zip(states.iter())...
```

**Impact:** Model now correctly associates work-duration deltas with Inside state.

## Usage

### Training the Model

```bash
cd rust
cargo test test_train_hmm -- --nocapture
```

This:
1. Loads all datasets from `dataset/*.tsv`
2. Trains HMM using MLE
3. Saves to `weights.json`
4. Evaluates on test data

### Running Inference (TypeScript)

```typescript
import { runHiddenMarkovModel } from 'rust'

const events = [
  { employee_id: 11, timestamp: 'Wed, 04 Feb 2026 06:41:36 GMT', id: 1005286 },
  { employee_id: 11, timestamp: 'Wed, 04 Feb 2026 15:30:26 GMT', id: 1005399 },
  // ... more events
]

const shifts = runHiddenMarkovModel(events)
// Returns detected work shifts
```

### Generating Training Datasets

```bash
cd server
npx tsx --test ./src/domains/hr/attendance/hmm_create_dataset.test.ts
```

Exports employee attendance data to `rust/dataset/{month}-{year}_{card}.tsv`

## Production Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Upload raw events from time-tracking device                  │
│    (card swipes with timestamps)                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Load pre-trained model (weights.json)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Run HMM inference                                            │
│    - Convert events → deltas → observations                     │
│    - Viterbi: observations → most likely states                 │
│    - Build shifts from state transitions                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Save detected intervals to database                          │
│    attendance.intervals table                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Performance

- **Training:** ~1 second for 14 datasets (200-300 events)
- **Inference:** ~10ms for 100 events
- **Accuracy:** ~95% on labeled test data (after Bug #2 fix)

## Troubleshooting

### Model predicts all "Outside" states

**Cause:** Model trained with Bug #2 (inverted alignment)

**Solution:** Retrain model with fixed code:
```bash
cargo test test_train_hmm
```

### Missing first work day of month

**Cause:** Bug #1 (first row skipped)

**Solution:** Already fixed in `dataset.rs`

### Only some days detected

**Possible causes:**
1. Model not trained on similar patterns
2. Anomalous data (e.g., 40-minute "work day")
3. Missing entry or exit events

**Solution:** Add more training data or manually correct intervals

## Mathematical Details

### Viterbi Algorithm

Used to find the most likely hidden state sequence:

```
Given: observations O = [o1, o2, ..., oN]
Find:  states S = [s1, s2, ..., sN] that maximizes P(S|O)
```

Complexity: O(N × K²) where N = sequence length, K = number of states

### State-Interval Alignment

Critical insight: **states describe intervals, not events**

```
Event[i] --delta[i]--> Event[i+1]
   │                       │
state[i]              state[i+1]
   │                       │
   └── describes ──────────┘
   the interval BETWEEN
```

This is why alignment matters: pairing delta[i] with the wrong state teaches the model incorrect patterns.

## References

### Learning Resources

1. **StatQuest: Hidden Markov Models** (YouTube) - Best visual introduction
2. **Hidden Markov Models Simply Explained** - Towards Data Science
3. **DigitalOcean HMM Tutorial** - Mathematical details with examples

### Key Concepts

- **Markov Property:** Future depends only on current state, not history
- **Hidden State:** Unobservable process we want to infer
- **Emission Probability:** P(observation | state)
- **Transition Probability:** P(next_state | current_state)
- **Viterbi Algorithm:** Dynamic programming for optimal state sequence

## License

Part of the piekorg ERP system.
