/**
 * render.js
 * All DOM rendering functions. No business logic — pure output.
 * Event delegation is set up once in main.js, not here.
 */

import { TRAITS } from "../data/traits.js";
import { normalizeTrait, categoryClass } from "../core/utils.js";
import { traitTooltipHtml, showTooltip, hideTooltip } from "./tooltip.js";

// ---------------------------------------------------------------------------
// Current Roll
// ---------------------------------------------------------------------------

/**
 * Re-renders the current roll grid.
 * @param {object[]|null} currentRoll
 * @param {HTMLElement} currentRollEl
 * @param {HTMLElement} chosenSummaryEl
 * @param {boolean} isAnimating - adds rolling CSS class when true
 */
export function renderCurrentRoll(currentRoll, currentRollEl, chosenSummaryEl, isAnimating = false) {
  const EMPTY_ROLL_HTML    = '<div class="empty">Roll traits</div>';
  const EMPTY_SUMMARY_HTML = '<div class="empty">Roll traits to see the full chosen-traits summary here.</div>';

  if (!currentRoll || !currentRoll.length) {
    currentRollEl.innerHTML   = EMPTY_ROLL_HTML;
    chosenSummaryEl.innerHTML = EMPTY_SUMMARY_HTML;
    return;
  }

  currentRollEl.innerHTML = currentRoll.map((rawTrait, index) => {
    const trait        = normalizeTrait(rawTrait);
    const rollingClass = isAnimating ? "rolling" : "";
    const delayStyle   = isAnimating
      ? `style="animation-delay:${index * 120}ms; --roll-duration: 0.5s"`
      : "";

    return `
      <article
        class="trait-card ${trait.locked ? "locked" : ""} ${rollingClass}"
        data-card-id="${trait.lockId}"
        ${delayStyle}
      >
        <div class="pill ${categoryClass(trait.category)}">${trait.category}</div>
        <div class="trait-name">${trait.name}</div>
        <div class="card-actions">
          <button class="ghost small-btn lock-btn"   data-lock-id="${trait.lockId}">
            ${trait.locked ? "🔒 Locked" : "🔓 Lock"}
          </button>
          <button class="secondary small-btn reroll-btn" data-reroll-id="${trait.lockId}">
            🔁 Reroll
          </button>
        </div>
      </article>
    `;
  }).join("");

  // Attach tooltip listeners to every card
  document.querySelectorAll(".trait-card").forEach((card) => {
    const trait = normalizeTrait(
      currentRoll.find((t) => String(t.lockId) === String(card.dataset.cardId))
    );
    const html = traitTooltipHtml(trait);

    card.addEventListener("mouseenter", (e) => showTooltip(html, e.clientX, e.clientY));
    card.addEventListener("mousemove",  (e) => showTooltip(html, e.clientX, e.clientY));
    card.addEventListener("mouseleave", hideTooltip);
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      showTooltip(html, e.clientX, e.clientY);
    });
  });

  renderChosenTraitsSummary(currentRoll, chosenSummaryEl);
}

// ---------------------------------------------------------------------------
// Chosen Traits Summary
// ---------------------------------------------------------------------------

export function renderChosenTraitsSummary(currentRoll, chosenSummaryEl) {
  if (!currentRoll || !currentRoll.length) {
    chosenSummaryEl.innerHTML = '<div class="empty">Roll traits to see the full chosen-traits summary here.</div>';
    return;
  }

  chosenSummaryEl.innerHTML = `
    <div class="chosen-summary-grid">
      ${currentRoll.map((rawTrait) => {
        const trait = normalizeTrait(rawTrait);
        return `
          <div class="chosen-summary-card">
            <div class="pill ${categoryClass(trait.category)}">${trait.category}</div>
            <h3>${trait.name}</h3>
            <div class="chosen-line"><strong>Explanation:</strong> ${trait.description}</div>
            <div class="chosen-line"><strong>Buff / Effect:</strong> ${trait.effect}</div>
            <div class="chosen-line"><strong>Conflict list:</strong> ${trait.conflicts.length ? trait.conflicts.join(", ") : "None mapped"}</div>
            <div class="chosen-line"><strong>Locked:</strong> ${trait.locked ? "Yes" : "No"}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

/**
 * Renders the saved rolls list. Attaches expand-toggle listener via delegation.
 * @param {object[][]} savedRolls
 * @param {HTMLElement} historyListEl
 */
export function renderHistory(savedRolls, historyListEl) {
  if (!savedRolls.length) {
    historyListEl.innerHTML = '<div class="empty">No saves</div>';
    return;
  }

  historyListEl.innerHTML = savedRolls.slice().reverse().map((entry, idx) => `
    <div class="history-item">
      <div class="history-head">
        <div><strong>Saved roll #${savedRolls.length - idx}</strong></div>
        <div class="small-note">Click to expand</div>
      </div>
      <div class="history-tags">
        ${entry.map((t) => `<span class="history-tag">${normalizeTrait(t).name}</span>`).join("")}
      </div>
      <div class="history-details">
        ${entry.map((raw) => {
          const trait = normalizeTrait(raw);
          return `<div class="ref-line"><strong>${trait.name}</strong> — ${trait.effect}</div>`;
        }).join("")}
      </div>
    </div>
  `).join("");

  // Expand/collapse via event delegation on the container
  historyListEl.onclick = (e) => {
    const head = e.target.closest(".history-head");
    if (head) head.parentElement.classList.toggle("open");
  };
}

// ---------------------------------------------------------------------------
// Trait Reference
// ---------------------------------------------------------------------------

/**
 * Renders the searchable/filterable trait reference section.
 * @param {string}      search         - current search string
 * @param {string}      filter         - "all" | "Good" | "Neutral" | "Bad"
 * @param {object[]|null} currentRoll  - highlighted traits
 * @param {HTMLElement} traitReferenceEl
 */
export function renderTraitReference(search, filter, currentRoll, traitReferenceEl) {
  const q = search.trim().toLowerCase();
  const currentRollNames = currentRoll ? currentRoll.map((t) => normalizeTrait(t).name) : [];

  const groups = [
    ["Good",    TRAITS.good],
    ["Neutral", TRAITS.neutral],
    ["Bad",     TRAITS.bad]
  ];

  const filtered = groups
    .map(([label, items]) => {
      const matching = items.filter((raw) => {
        const trait = normalizeTrait(raw);
        if (filter !== "all" && trait.category !== filter) return false;
        if (!q) return true;
        return (
          trait.name.toLowerCase().includes(q)        ||
          trait.description.toLowerCase().includes(q) ||
          trait.effect.toLowerCase().includes(q)      ||
          trait.conflicts.some((c) => c.toLowerCase().includes(q))
        );
      });
      return [label, matching];
    })
    .filter(([, items]) => items.length);

  if (!filtered.length) {
    traitReferenceEl.innerHTML = '<div class="empty">No traits match your current search/filter.</div>';
    return;
  }

  traitReferenceEl.innerHTML = filtered.map(([label, items]) => `
    <div class="reference-group">
      <h3>${label} traits</h3>
      <div class="reference-list">
        ${items.map((raw) => {
          const trait     = normalizeTrait(raw);
          const glowClass = currentRollNames.includes(trait.name) ? "reference-item-glow" : "";
          return `
            <div class="reference-item ${glowClass}">
              <strong>${trait.name}</strong>
              <div class="ref-line"><strong>Explanation:</strong> ${trait.description}</div>
              <div class="ref-line"><strong>Buff / Effect:</strong> ${trait.effect}</div>
              <div class="ref-line"><strong>Conflicts:</strong> ${trait.conflicts.length ? trait.conflicts.join(", ") : "None mapped"}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}
