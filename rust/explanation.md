
## 1️⃣ The core misunderstanding (very important)

> “How can the model understand *inside vs outside* if I don’t pass states?”

**Short answer:**
👉 **It doesn’t “understand” inside/outside.**
👉 It only discovers **hidden patterns**.
👉 *You* later **interpret** those patterns as “inside” or “outside”.

This is the HMM mindset shift.

---

## 2️⃣ What an HMM really is (in your case)

Your data:

```
event ── time gap ── event ── time gap ── event
          ↑ obs         ↑ obs
```

You feed the model only this:

```
Observations = [Short, Medium, VeryLong, Short, ...]
```

The HMM assumes:

* There exists a **hidden state** at each event
* That state causes the observed time gap
* States change slowly over time

### Example hidden states (NOT named yet):

```
State 0
State 1
```

The model does **not** know what these mean.

---

## 3️⃣ What the HMM learns without labels

Given many sequences, the HMM learns:

### 1. Transition probabilities

> “If I’m in State X now, how likely am I to stay or switch?”

Example it might learn:

```
State 0 → State 0 : 95%
State 0 → State 1 : 5%

State 1 → State 1 : 90%
State 1 → State 0 : 10%
```

➡️ This matches **long stretches of same behavior**.

---

### 2. Emission probabilities

> “What observations usually happen in each state?”

Example it might learn:

```
State 0 emits:
  VeryShort: 40%
  Short:     50%
  Medium:    10%
  Long:       0%

State 1 emits:
  Medium:    20%
  Shift:     50%
  Long:      25%
  VeryLong:   5%
```

➡️ One state likes **short gaps**, the other likes **long gaps**.

---

## 4️⃣ Where “inside” and “outside” come from

After training, you inspect the model and say:

> “Ah.
> The state that emits mostly **short gaps** looks like someone is **inside**.
> The state that emits **long gaps** looks like someone is **outside**.”

So you *map*:

```
State 0 → Inside
State 1 → Outside
```

This step is **manual interpretation**, not ML magic.

---

## 5️⃣ Why this works for badge scans

Real human behavior has structure:

### When someone is **inside**

* Lunch out/in → 30–60 min
* Coffee breaks → 5–15 min
* Short erratic gaps

### When someone is **outside**

* Night gap → 12–16 hours
* Weekend → 48 hours
* Long stable gaps

You never told the model this —
but the **statistics force it to discover it**.

---

## 6️⃣ What happens during prediction

Given new observations:

```
[Short, Short, Medium, Long, VeryLong, Short]
```

The HMM runs **Viterbi** and outputs:

```
[State 0, State 0, State 0, State 1, State 1, State 0]
```

After your mapping:

```
[Inside, Inside, Inside, Outside, Outside, Inside]
```

👉 That’s your inferred entry/exit sequence.

---

## 7️⃣ How entry/exit intervals come out

Once you have inferred states:

```
time    state
08:55   Outside
09:00   Inside   ← entry
12:05   Outside  ← exit
13:00   Inside   ← entry
17:10   Outside  ← exit
```

You derive intervals **after inference**, not during training.

---

## 8️⃣ Why labels are OPTIONAL (but helpful)

### Unlabeled HMM (what you’re asking about)

✅ Works
✅ Discovers patterns
❌ States have no semantic names
❌ You must interpret them

### Labeled HMM

✅ Faster convergence
✅ Stable meaning of states
❌ Requires ground truth

For your case:

> **Start unlabeled. Interpret later.**

---

## 9️⃣ Analogy that usually makes it click

Imagine watching an alien press a button:

* Sometimes presses again after 2 minutes
* Sometimes after 14 hours

You don’t know:

* “home”
* “office”
* “sleep”

But you can still say:

> “There are two modes of behavior.”

That’s *exactly* what HMM does.

---

## 🔑 Final mental model (remember this)

> **HMM does not predict meaning.**
> **It predicts structure.**
> **Meaning is applied by you afterward.**
