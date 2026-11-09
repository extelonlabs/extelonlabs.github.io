/**
 * roll.js
 * Roll generation logic: picks non-conflicting trait sets from each category pool.
 */

import { TRAITS } from "../data/traits.js";
import { normalizeTrait, sameTrait, shuffle, getPoolByCategory } from "./utils.js";
import { conflictsWithAny } from "./conflicts.js";

// Incremented each time a new lockId is needed so every trait card has a unique ID.
let nextLockId = 1;
export function getNextLockId() { return nextLockId++; }

/**
 * Reads the count inputs and validates them against the total.
 * If the sum doesn't match total, auto-distributes randomly and updates the UI.
 * @param {object} els - cached DOM element references
 * @param {function} showStatus
 * @returns {{ good: number, neutral: number, bad: number }}
 */
export function getBalancedCounts(els, showStatus) {
  const total = Math.max(1, parseInt(els.totalCount.value, 10) || 3);
  let good    = Math.max(0, parseInt(els.goodCount.value,    10) || 0);
  let neutral = Math.max(0, parseInt(els.neutralCount.value, 10) || 0);
  let bad     = Math.max(0, parseInt(els.badCount.value,     10) || 0);

  if (good + neutral + bad !== total) {
    good = neutral = bad = 0;
    for (let i = 0; i < total; i++) {
      const r = Math.random();
      if      (r < 0.34) good++;
      else if (r < 0.67) neutral++;
      else               bad++;
    }
    els.goodCount.value    = good;
    els.neutralCount.value = neutral;
    els.badCount.value     = bad;
    showStatus("Category counts were auto-balanced to match Total traits.", "ok");
  }

  return { good, neutral, bad };
}

/**
 * Collects the currently locked traits grouped by category.
 * @param {object[]|null} currentRoll
 * @returns {{ Good: object[], Neutral: object[], Bad: object[] }}
 */
export function getLockedByCategory(currentRoll) {
  const map = { Good: [], Neutral: [], Bad: [] };
  if (!currentRoll) return map;

  for (const raw of currentRoll) {
    const trait = normalizeTrait(raw);
    if (trait.locked && map[trait.category]) {
      map[trait.category].push(trait);
    }
  }
  return map;
}

/**
 * Fills one category slot up to `neededCount`, respecting locks and conflicts.
 * Returns the chosen array on success, or null if it was impossible.
 * @param {object[]} pool                   - full trait pool for this category
 * @param {number}   neededCount
 * @param {object[]} alreadyPicked          - traits already committed across all categories
 * @param {object[]} lockedAlreadyInCategory
 * @returns {object[]|null}
 */
export function pickForCategory(pool, neededCount, alreadyPicked, lockedAlreadyInCategory) {
  const chosen = lockedAlreadyInCategory.map(normalizeTrait);
  if (chosen.length > neededCount) return null;

  const available = shuffle(pool).filter(
    (t) => !chosen.some((c) => sameTrait(c, t)) &&
           !alreadyPicked.some((c) => sameTrait(c, t))
  );

  for (const raw of available) {
    if (chosen.length >= neededCount) break;
    const candidate = normalizeTrait(raw);
    if (!conflictsWithAny(candidate, [...alreadyPicked, ...chosen])) {
      candidate.locked = false;
      candidate.lockId = nextLockId++;
      chosen.push(candidate);
    }
  }

  return chosen.length === neededCount ? chosen : null;
}

/**
 * Attempts up to 400 times to generate a valid, non-conflicting roll.
 * Returns an array of trait objects on success, or null on failure.
 * @param {object} els       - cached DOM elements
 * @param {function} showStatus
 * @param {object[]|null} currentRoll
 * @returns {object[]|null}
 */
export function generateRoll(els, showStatus, currentRoll) {
  const counts = getBalancedCounts(els, showStatus);
  const locked = getLockedByCategory(currentRoll);

  for (let attempt = 0; attempt < 400; attempt++) {
    let picked = [];

    const goodPick = pickForCategory(TRAITS.good, counts.good, picked, locked.Good);
    if (!goodPick) continue;
    picked = [...picked, ...goodPick];

    const neutralPick = pickForCategory(TRAITS.neutral, counts.neutral, picked, locked.Neutral);
    if (!neutralPick) continue;
    picked = [...picked, ...neutralPick];

    const badPick = pickForCategory(TRAITS.bad, counts.bad, picked, locked.Bad);
    if (!badPick) continue;
    picked = [...picked, ...badPick];

    return picked;
  }

  return null;
}

/**
 * Finds a valid replacement trait for a single card reroll.
 * Returns the new trait object on success, or null if no valid swap exists.
 * @param {string|number} lockId
 * @param {object[]} currentRoll
 * @returns {object|null}
 */
export function findRerollCandidate(lockId, currentRoll) {
  const existing = currentRoll.map(normalizeTrait);
  const index = existing.findIndex((t) => String(t.lockId) === String(lockId));
  if (index === -1) return null;

  const target = existing[index];
  const pool   = getPoolByCategory(target.category, TRAITS);
  const others = existing.filter((_, i) => i !== index);

  const available = shuffle(pool)
    .map(normalizeTrait)
    .filter((c) => !sameTrait(c, target) &&
                   !others.some((p) => sameTrait(p, c)) &&
                   !conflictsWithAny(c, others));

  return available[0] ?? null;
}
