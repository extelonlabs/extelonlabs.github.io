/**
 * presets.js
 * Roll preset configurations.
 * To add a new preset: add an entry here AND add a button in index.html
 * with data-preset="yourKey".
 */

export const PRESETS = {
  balanced: { total: 3, good: 1, neutral: 1, bad: 1 },
  lucky:    { total: 4, good: 3, neutral: 1, bad: 0 },
  cursed:   { total: 4, good: 0, neutral: 1, bad: 3 },
  chaos:    { total: 5, good: 2, neutral: 1, bad: 2 },
  minmax:   { total: 4, good: 2, neutral: 0, bad: 2 }
};
