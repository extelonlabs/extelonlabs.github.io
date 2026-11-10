/**
 * animate.js
 * Roll and reroll animation logic.
 */

import { TRAITS } from "../data/traits.js";
import { normalizeTrait, categoryClass, getPoolByCategory } from "../core/utils.js";
import { getNextLockId } from "../core/roll.js";

/**
 * Runs the slot-machine animation across all trait cards, then settles on newRoll.
 * @param {object[]} newRoll
 * @param {object[]|null} currentRoll  - mutated in-place; caller should hold the ref
 * @param {function} setCurrentRoll    - callback(newArray) to update state in main.js
 * @param {function} renderFn          - renderCurrentRoll bound to current DOM refs
 */
export async function animateRoll(newRoll, currentRoll, setCurrentRoll, renderFn) {
  const total    = newRoll.length;
  const allPools = { Good: TRAITS.good, Neutral: TRAITS.neutral, Bad: TRAITS.bad };

  // Initialise a placeholder roll if nothing exists yet
  if (!currentRoll || !currentRoll.length) {
    setCurrentRoll(newRoll.map((t) => ({ ...normalizeTrait(t), locked: false })));
    currentRoll = newRoll.map((t) => ({ ...normalizeTrait(t), locked: false }));
  }

  const frames             = 18;
  const totalAnimationTime = 2200;
  let   elapsedTime        = 0;

  for (let frame = 0; frame < frames; frame++) {
    const progress     = frame / (frames - 1);
    // Ease-in-out quadratic
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    const frameDelay = (easedProgress * totalAnimationTime) - elapsedTime;
    elapsedTime += frameDelay;

    const preview = [];
    for (let i = 0; i < total; i++) {
      const finalTrait = normalizeTrait(newRoll[i]);
      const existing   = currentRoll[i] ? normalizeTrait(currentRoll[i]) : null;

      if (existing?.locked && existing.category === finalTrait.category) {
        preview.push(existing);
      } else {
        const pool        = allPools[finalTrait.category] || [];
        const randomTrait = normalizeTrait(pool[Math.floor(Math.random() * pool.length)]);
        randomTrait.lockId = existing?.lockId ?? getNextLockId();
        preview.push(randomTrait);
      }
    }

    setCurrentRoll(preview);
    currentRoll = preview;
    renderFn(true);
    await delay(Math.max(10, frameDelay));
  }

  // Settle on the final roll
  const merged = newRoll.map((finalRaw, i) => {
    const finalTrait = normalizeTrait(finalRaw);
    const old        = currentRoll[i] ? normalizeTrait(currentRoll[i]) : null;
    finalTrait.locked = !!old?.locked && old?.name === finalTrait.name;
    finalTrait.lockId = old?.lockId ?? getNextLockId();
    return finalTrait;
  });

  setCurrentRoll(merged);
  renderFn(true);

  await delay(520);
  renderFn(false);
}

// ---------------------------------------------------------------------------
// Single-card reroll animation
// ---------------------------------------------------------------------------

// Timing table for the deceleration effect (ms offsets from start)
const REROLL_FRAME_TIMES = [
  0,    50,   105,  165,  230,  300,  380,  470,  570,  680,
  800,  935,  1085, 1250, 1430, 1625, 1835, 2060, 2300, 2560,
  2880, 3070, 3270, 3480, 3700, 3930, 4170, 4420, 4690, 5000,
  5180, 5400, 5660, 5960, 6300, 6300
];

/**
 * Animates a single trait card cycling through random names, then settles.
 * Updates currentRoll in-place and calls renderFn() at the end.
 * @param {string|number} lockId
 * @param {object} finalTrait        - the trait to land on
 * @param {object} originalTrait     - the trait being replaced (for status message)
 * @param {object[]} currentRoll     - mutated in-place
 * @param {function} setCurrentRoll
 * @param {function} renderFn
 * @param {function} renderRefFn     - renderTraitReference bound call
 * @param {function} showStatus
 */
export async function animateRerollSingle(
  lockId, finalTrait, originalTrait,
  currentRoll, setCurrentRoll,
  renderFn, renderRefFn, showStatus
) {
  const card = document.querySelector(`[data-card-id="${lockId}"]`);
  if (!card) return;

  const pool  = getPoolByCategory(originalTrait.category, TRAITS);
  const start = performance.now();

  card.classList.add("rerolling");

  for (let frame = 0; frame < REROLL_FRAME_TIMES.length; frame++) {
    const randomTrait = normalizeTrait(pool[Math.floor(Math.random() * pool.length)]);

    const pillEl = card.querySelector(".pill");
    const nameEl = card.querySelector(".trait-name");
    if (pillEl) pillEl.textContent = randomTrait.category;
    if (nameEl) nameEl.textContent = randomTrait.name;

    // Swap category colour class
    card.className = card.className.replace(/\bgood\b|\bneutral\b|\bbad\b/g, "");
    card.classList.add(categoryClass(randomTrait.category));

    const wait = Math.max(0, start + REROLL_FRAME_TIMES[frame] - performance.now());
    await delay(wait);
  }

  await delay(500);

  // Settle on final trait
  const pillEl = card.querySelector(".pill");
  const nameEl = card.querySelector(".trait-name");
  if (pillEl) pillEl.textContent = finalTrait.category;
  if (nameEl) nameEl.textContent = finalTrait.name;

  card.className = card.className.replace(/\bgood\b|\bneutral\b|\bbad\b/g, "");
  card.classList.add(categoryClass(finalTrait.category));

  // Update state
  const updated   = currentRoll.map(normalizeTrait);
  const foundIdx  = updated.findIndex((t) => String(t.lockId) === String(lockId));
  if (foundIdx !== -1) {
    finalTrait.locked = false;
    finalTrait.lockId = lockId;
    updated[foundIdx] = finalTrait;
    setCurrentRoll(updated);
  }

  await delay(300);
  card.classList.remove("rerolling");
  renderFn(false);
  renderRefFn();
  showStatus(`Rerolled ${originalTrait.name} into ${finalTrait.name}.`, "ok");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
