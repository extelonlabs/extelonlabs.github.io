# RimWorld Trait Dice Game

This is a web-based application that simulates rolling traits for characters in the game RimWorld. It allows users to generate random trait combinations while respecting conflict rules, lock traits, save rolls, and share results.

link : https://extelonlabs.github.io/

## Features

- **Trait Rolling**: Generate random trait sets with configurable counts for Good, Neutral, and Bad categories.
- **Conflict Resolution**: Automatically avoids conflicting traits based on predefined conflict groups and individual conflicts.
- **Trait Locking**: Lock specific traits to keep them fixed during rerolls.
- **Presets**: Quick settings for common roll types (e.g., Balanced, Lucky, Cursed).
- **Animation**: Animated rolling effect for visual feedback.
- **Tooltips and Details**: Hover or click trait cards for quick info; detailed summaries in the Chosen Traits section.
- **Searchable Reference**: Browse and search all traits with filters by category.
- **Save and Share**: Save rolls to local storage, copy roll text, or generate shareable links.
- **History**: View and expand saved rolls.
- **Responsive Design**: Works on desktop and mobile devices.

## How to Use

1. Open [`index.html`](index.html ) in a web browser.
2. Adjust the total traits and category counts (Good, Neutral, and Bad) or use a preset.
3. Click "🎲 Roll Traits" to generate a new set.
4. Hover over or click trait cards for tooltips.
5. Lock traits to prevent them from changing on rerolls.
6. Use "🔁 Reroll" on individual traits if needed.
7. Save the roll with "💾 Save Roll".
8. Copy the roll text or share a link using the respective buttons.
9. Browse the trait reference with search and filters.

## Code Structure

- **[`index.html`](index.html )**: The main HTML structure, including the UI layout and elements.
- **[`script.js`](script.js )**: Contains all JavaScript logic, including trait data, conflict mapping, roll generation, event handlers, and rendering functions.
- **[`styles.css`](styles.css )**: CSS styles for the UI, including themes, animations, and responsive design.

Key functions in [`script.js`](script.js ):
- [`makeTrait()`](script.js ): Creates trait objects.
- [`buildConflictMap()`](script.js ): Builds a map of trait conflicts.
- [`generateRoll()`](script.js ): Generates a non-conflicting trait set.
- [`animateRoll()`](script.js ): Handles the rolling animation.
- [`renderCurrentRoll()`](script.js ): Updates the current roll display.
- [`renderTraitReference()`](script.js ): Populates the searchable trait reference.

## Technologies Used

- **HTML5**: Structure and content.
- **CSS3**: Styling, animations, and responsive layout.
- **JavaScript (ES6+)**: Logic, DOM manipulation, and local storage.

No external dependencies are required; the app runs entirely in the browser.

## Installation

No installation needed. Clone or download the files and open [`index.html`](index.html ) in any modern web browser. Data is stored locally in the browser's localStorage.
