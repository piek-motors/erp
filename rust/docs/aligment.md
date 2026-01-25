## 1. Raw events what we observe

```
Index:   0           1           2           3
         |           |           |           |
Events:  E0          E1          E2          E3
Times:   08:55       12:05       13:00       17:10
```

---

## 2. Deltas (computed gaps)

Computed as:

```
delta[i] = E[i+1] - E[i]
```

So:

```
Index:          0               1               2
                |               |               |
Deltas:     Δ0 = E1-E0       Δ1 = E2-E1       Δ2 = E3-E2
Durations:   3h10m            55m               4h10m
```

Important:

```
N events → N-1 deltas
```

---

## 3. Observations - discretized deltas

Each delta is converted to a discrete bucket.

```
Index:            0               1               2
                  |               |               |
Observations:   Medium           Short            Shift
```

Rule:

```
observation[i] describes delta[i]
```

---

## 4. Hidden states (what HMM predicts)

HMM outputs **one state per observation**.

```
Index:            0               1               2
                  |               |               |
Hidden state:   Inside          Outside          Inside
```

Rule:

```
hidden_state[i] describes the SAME interval as observation[i]
```

---

## 5. Where states live (this is the key insight)

States do **not** live on events.
They live **between** events.

```
E0 ----(state[0])---- E1 ----(state[1])---- E2 ----(state[2])---- E3
     Inside                 Outside               Inside
```

This is the **core alignment rule**.

---

## 6. Interval interpretation

From the above, you can reconstruct intervals:

| Interval | State   | Meaning              |
| -------- | ------- | -------------------- |
| E0 → E1  | Inside  | Employee was at work |
| E1 → E2  | Outside | Employee was away    |
| E2 → E3  | Inside  | Employee returned    |

---

## 7. Why the first event has no state

There is **no interval before E0**.

```
??? ---- E0
```

So:

* No delta
* No observation
* No state

This is why:

```
states.len() == events.len() - 1
```

---

## 8. Why the last event is special

If E3 is the **last known event**:

```
E2 ----(Inside)---- E3 ---- ?
```

You must output:

```
[entry = E2, exit = null]
```

Because:

* The interval started
* But was never closed by a next event

---

## 9. One-line invariant (put this in your head)

```
State[i] describes what happened between Event[i] and Event[i+1]
```

If any part of your code violates this — it is wrong.

---

## 10. Full pipeline summary (final)

```
Events (N)
   ↓
Deltas (N-1)
   ↓
Observations (N-1)
   ↓
Hidden States (N-1)
   ↓
Intervals between events
```

---

# How *one wrong alignment choice* breaks interval reconstruction.

Employee day:

```
08:55  swipe  (arrives)
17:10  swipe  (leaves)
```

Reality:

```
Employee was INSIDE from 08:55 → 17:10
```


## Correct alignment

### Events

```
E0 -------- E1
08:55      17:10
```

### Delta

```
Δ0 = E1 - E0 = 8h15m
```

### Observation

```
obs[0] = Shift
```

### HMM prediction

```
state[0] = Inside
```

### Interval reconstruction

```
[08:55 → 17:10] = Inside
```

✔ Correct
✔ No ambiguity
✔ No heuristics

---

## Now let’s break it (incorrect alignment)

### ❌ Wrong assumption

> “state[i] describes the interval BEFORE event[i]”


## Case 1: Attaching state to the *later* event

You decide:

```
state[1] = Inside
```

Instead of:

```
state[0] = Inside
```

### What your data now looks like

```
Event index:   0        1
               |        |
Events:      08:55    17:10
States:                Inside
```

### Interval reconstruction attempt

You now try to say:

> “Inside from ? → 17:10”

But:

* Where did it start?
* Was the employee inside before 08:55?
* Did the shift start at midnight?

You have **lost the entry time**.

Result:

```
[null → 17:10] = Inside
```

❌ Wrong
❌ Payroll error
❌ Impossible to fix later

---

## Case 2: Attaching state to the *earlier* event

You decide:

```
state[0] = Inside
```

But interpret it as:

> “state at event 0”

### Now add another event

```
08:55   12:05   17:10
```

Predicted states:

```
state[0] = Inside
state[1] = Outside
```

You reconstruct:

```
08:55 → ? = Inside
12:05 → ? = Outside
```

You now have **two overlapping open intervals**:

```
Inside: 08:55 → ?
Outside: 12:05 → ?
```

❌ Logical contradiction
❌ Cannot decide which interval closed where
❌ You’ll invent heuristics to patch this

---

## Case 3: Off-by-one shift (silent data corruption)

This is the most dangerous one.

### You accidentally shift states by +1

```
E0 ---- Δ0 ---- E1 ---- Δ1 ---- E2
        s1           s2
```

Instead of:

```
        s0           s1
```

### Reconstruction result

```
Interval E0 → E1 gets state of E1 → E2
Interval E1 → E2 gets state of E2 → E3 (nonexistent)
```

Effects:

* Lunch breaks appear as work
* Work shifts appear as absences
* Long gaps look “reasonable” but wrong

❌ No crash
❌ No panic
❌ Payroll slowly drifts

This is how bugs survive for years.

---

## Why interval-based alignment fixes everything

Correct rule:

```
state[i] ↔ interval (E[i] → E[i+1])
```

This guarantees:

1. Every state has **two timestamps**
2. Every interval has **exactly one state**
3. Open intervals are explicit (`exit = null`)
4. Missing swipes become *long deltas*, not logic bugs

---

## Visual comparison (final)

### ❌ Wrong (state on events)

```
E0    E1    E2
 |     |     |
       S
```

No duration. No entry. No exit.

---

### ✅ Correct (state on intervals)

```
E0 --(S0)-- E1 --(S1)-- E2
```

Durations are explicit. Intervals are closed.

---

## One invariant to enforce in code

Put this in your head and in comments:

> **If a state does not span time, it is meaningless.**

Your model predicts **time spans**, not points.

---

If you want next, I can:

* show how this exact bug appears in real attendance systems
* help you write an `assert_alignment()` test
* map predicted states directly into `[entry, exit]` records safely
