/**
 * conflicts.js
 * Builds the conflict map from trait data and exposes conflict-checking helpers.
 */

import { TRAITS, CONFLICT_GROUPS } from "../data/traits.js";
import { normalizeTrait } from "./utils.js";

/**
 * Populates trait.conflicts[] for every trait based on CONFLICT_GROUPS.
 * Call once at startup — mutates the TRAITS arrays in place.
 */
export function buildConflictMap() {
  const all = [...TRAITS.good, ...TRAITS.neutral, ...TRAITS.bad];
  const map = {};

  // Initialise a set for every trait
  for (const trait of all) map[trait.name] = new Set();

  // Forward pass: each trait adds everyone else in its conflict groups
  for (const trait of all) {
    for (const groupName of trait.conflictGroups || []) {
      for (const otherName of CONFLICT_GROUPS[groupName] || []) {
        if (otherName !== trait.name) map[trait.name].add(otherName);
      }
    }
  }

  // Symmetry pass: make all conflicts bidirectional
  for (const name of Object.keys(map)) {
    for (const otherName of [...map[name]]) {
      if (!map[otherName]) map[otherName] = new Set();
      map[otherName].add(name);
    }
  }

  // Write sorted conflict arrays back onto each trait object
  for (const trait of all) {
    trait.conflicts = [...(map[trait.name] || [])].sort();
  }
}

/**
 * Returns true if `candidate` conflicts with any trait already in `picked`.
 * @param {object} candidate - raw or normalised trait object
 * @param {object[]} picked  - array of raw or normalised trait objects
 */
export function conflictsWithAny(candidate, picked) {
  const c = normalizeTrait(candidate);
  for (const item of picked) {
    const p = normalizeTrait(item);
    if (c.name === p.name) return true;
    if (c.conflicts.includes(p.name)) return true;
    if (p.conflicts.includes(c.name)) return true;
  }
  return false;
}
