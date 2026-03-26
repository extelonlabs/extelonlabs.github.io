/**
 * utils.js
 * Shared pure-utility functions with no side effects.
 */

/**
 * Fisher-Yates shuffle — unbiased, unlike sort(() => Math.random() - 0.5).
 * Returns a new array; does not mutate the input.
 * @param {any[]} arr
 * @returns {any[]}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns a safe, fully-populated trait object regardless of what was stored.
 * Useful when reading traits from localStorage or URL share payloads.
 * @param {any} trait
 * @returns {object}
 */
export function normalizeTrait(trait) {
  return {
    name:        trait?.name        || "Unknown trait",
    category:    trait?.category    || "Unknown",
    effect:      trait?.effect      || "No effect text added yet.",
    description: trait?.description || "No description added yet.",
    conflicts:   Array.isArray(trait?.conflicts) ? trait.conflicts : [],
    locked:      !!trait?.locked,
    lockId:      trait?.lockId ?? null
  };
}

/**
 * Returns true if two traits represent the same trait by name.
 */
export function sameTrait(a, b) {
  return normalizeTrait(a).name === normalizeTrait(b).name;
}

/**
 * Converts a category string to a CSS class name.
 * e.g. "Good" → "good", "Very Bad" → "very-bad"
 */
export function categoryClass(category) {
  return String(category || "").toLowerCase().replace(/\s+/g, "-");
}

/**
 * Maps a category name to the matching TRAITS pool.
 * Avoids repeating ternary chains throughout the codebase.
 * @param {string} category - "Good" | "Neutral" | "Bad"
 * @param {object} TRAITS   - the TRAITS object from traits.js
 * @returns {object[]}
 */
export function getPoolByCategory(category, TRAITS) {
  return TRAITS[category.toLowerCase()] ?? TRAITS.bad;
}
