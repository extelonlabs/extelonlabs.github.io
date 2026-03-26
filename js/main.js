/**
 * main.js
 * Application entry point.
 * Responsibilities: initialise modules, wire up event listeners, manage state.
 * No rendering or business logic lives here — delegate to the appropriate module.
 */

import { TRAITS }                              from "./data/traits.js";
import { PRESETS }                             from "./data/presets.js";
import { buildConflictMap }                    from "./core/conflicts.js";
import { normalizeTrait }                      from "./core/utils.js";
import { generateRoll, findRerollCandidate, getNextLockId } from "./core/roll.js";
import { animateRoll, animateRerollSingle }    from "./ui/animate.js";
import { renderCurrentRoll, renderHistory, renderTraitReference } from "./ui/render.js";
import { initTooltip }                         from "./ui/tooltip.js";
import { setupMusicControls, startMusicOnFirstInteraction } from "./ui/music.js";

// ---------------------------------------------------------------------------
// Bootstrap conflict map (runs once, mutates TRAITS in place)
// ---------------------------------------------------------------------------
buildConflictMap();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = "rimworld-trait-dice-history-v4";

// ---------------------------------------------------------------------------
// Cached DOM references
// ---------------------------------------------------------------------------
const els = {
  currentRoll:      document.getElementById("currentRoll"),
  historyList:      document.getElementById("historyList"),
  traitReference:   document.getElementById("traitReference"),
  chosenSummary:    document.getElementById("chosenTraitsSummary"),
  statusArea:       document.getElementById("statusArea"),
  totalCount:       document.getElementById("totalCount"),
  goodCount:        document.getElementById("goodCount"),
  neutralCount:     document.getElementById("neutralCount"),
  badCount:         document.getElementById("badCount"),
  referenceSearch:  document.getElementById("referenceSearch"),
  referenceFilter:  document.getElementById("referenceFilter"),
};

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------
let currentRoll = null;
let savedRolls  = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// ---------------------------------------------------------------------------
// State mutation helper — keeps state updates explicit
// ---------------------------------------------------------------------------
function setCurrentRoll(roll) { currentRoll = roll; }

// ---------------------------------------------------------------------------
// Bound render helpers (pre-fill the stable args so call sites stay tidy)
// ---------------------------------------------------------------------------
function doRenderCurrentRoll(isAnimating = false) {
  renderCurrentRoll(currentRoll, els.currentRoll, els.chosenSummary, isAnimating);
}

function doRenderHistory() {
  renderHistory(savedRolls, els.historyList);
}

function doRenderTraitReference() {
  renderTraitReference(
    els.referenceSearch.value,
    els.referenceFilter.value,
    currentRoll,
    els.traitReference
  );
}

// ---------------------------------------------------------------------------
// Status helper
// ---------------------------------------------------------------------------
function showStatus(message, type = "") {
  if (!message) { els.statusArea.innerHTML = ""; return; }
  els.statusArea.innerHTML =
    `<div class="status-message ${type}">${message}</div>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function currentRollText() {
  if (!currentRoll?.length) return "No traits rolled.";
  return currentRoll
    .map((raw) => { const t = normalizeTrait(raw); return `${t.category}: ${t.name} — ${t.effect}`; })
    .join("\n");
}

function persistHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRolls));
}

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  els.totalCount.value   = preset.total;
  els.goodCount.value    = preset.good;
  els.neutralCount.value = preset.neutral;
  els.badCount.value     = preset.bad;
  showStatus(`Applied preset: ${name}.`, "ok");
}

function hydrateSharedRollFromHash() {
  if (!location.hash.startsWith("#roll=")) return;
  try {
    const encoded = location.hash.slice(6);
    const parsed  = JSON.parse(atob(decodeURIComponent(encoded)));
    setCurrentRoll(parsed.map((t) => ({ ...normalizeTrait(t), lockId: getNextLockId() })));
    doRenderCurrentRoll();
    showStatus("Loaded shared roll from URL.", "ok");
  } catch {
    showStatus("Could not load shared roll from URL.", "error");
  }
}

// ---------------------------------------------------------------------------
// Event listeners — Roll panel buttons
// ---------------------------------------------------------------------------

document.getElementById("rollBtn").addEventListener("click", async () => {
  const nextRoll = generateRoll(els, showStatus, currentRoll);
  if (!nextRoll) {
    showStatus("Could not generate a non-conflicting roll. Try fewer traits or unlock some.", "error");
    return;
  }
  showStatus("Rolling traits...", "ok");
  await animateRoll(
    nextRoll.map((t) => ({ ...normalizeTrait(t), lockId: getNextLockId() })),
    currentRoll,
    setCurrentRoll,
    doRenderCurrentRoll
  );
  showStatus("Roll complete.", "ok");
  doRenderTraitReference();
});

document.getElementById("saveBtn").addEventListener("click", () => {
  if (!currentRoll?.length) return;
  savedRolls.push(currentRoll.map(normalizeTrait));
  persistHistory();
  doRenderHistory();
  showStatus("Saved current roll.", "ok");
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentRollText());
    showStatus("Copied current roll to clipboard.", "ok");
  } catch {
    showStatus("Could not copy — browser blocked clipboard access.", "error");
  }
});

document.getElementById("shareBtn").addEventListener("click", async () => {
  if (!currentRoll?.length) {
    showStatus("Roll traits first before creating a share link.", "error");
    return;
  }
  const payload = encodeURIComponent(btoa(JSON.stringify(currentRoll.map(normalizeTrait))));
  const url     = `${location.origin}${location.pathname}#roll=${payload}`;
  try {
    await navigator.clipboard.writeText(url);
    showStatus("Share link copied to clipboard.", "ok");
  } catch {
    showStatus(url, "ok");
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  setCurrentRoll(null);
  doRenderCurrentRoll();
  showStatus("Cleared current roll.", "ok");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  setCurrentRoll(null);
  savedRolls = [];
  els.totalCount.value   = 3;
  els.goodCount.value    = 1;
  els.neutralCount.value = 1;
  els.badCount.value     = 1;
  persistHistory();
  doRenderCurrentRoll();
  doRenderHistory();
  showStatus("Reset roll, saves, and settings.", "ok");
});

// ---------------------------------------------------------------------------
// Event delegation — trait card lock & reroll buttons
// ---------------------------------------------------------------------------

els.currentRoll.addEventListener("click", (e) => {
  const lockBtn   = e.target.closest(".lock-btn");
  const rerollBtn = e.target.closest(".reroll-btn");

  if (lockBtn) {
    const id = lockBtn.dataset.lockId;
    let changedCardId = null;

    for (let i = 0; i < currentRoll.length; i++) {
      if (String(currentRoll[i].lockId) === String(id)) {
        currentRoll[i].locked = !currentRoll[i].locked;
        changedCardId = currentRoll[i].lockId;
        break;
      }
    }

    doRenderCurrentRoll(false);

    if (changedCardId !== null) {
      const card = document.querySelector(`[data-card-id="${changedCardId}"]`);
      if (card) {
        card.classList.add("lock-pulse");
        setTimeout(() => card.classList.remove("lock-pulse"), 450);
      }
    }

    showStatus("Updated trait lock state.", "ok");
  }

  if (rerollBtn) {
    const id        = rerollBtn.dataset.rerollId;
    const existing  = currentRoll.map(normalizeTrait);
    const index     = existing.findIndex((t) => String(t.lockId) === String(id));
    if (index === -1) return;

    const originalTrait = existing[index];
    const finalTrait    = findRerollCandidate(id, currentRoll);

    if (!finalTrait) {
      showStatus("No valid reroll found — would cause a conflict.", "error");
      return;
    }

    const audio = new Audio("Soundeffects/reroll.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});

    animateRerollSingle(
      id, finalTrait, originalTrait,
      currentRoll, setCurrentRoll,
      doRenderCurrentRoll, doRenderTraitReference, showStatus
    );
  }
});

// ---------------------------------------------------------------------------
// Preset buttons
// ---------------------------------------------------------------------------
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
});

// ---------------------------------------------------------------------------
// Reference search / filter
// ---------------------------------------------------------------------------
els.referenceSearch.addEventListener("input",  doRenderTraitReference);
els.referenceFilter.addEventListener("change", doRenderTraitReference);

// ---------------------------------------------------------------------------
// Self-tests (console only — no UI side effects)
// ---------------------------------------------------------------------------
function runSelfTests() {
  const industrious = TRAITS.good.find((t) => t.name === "Industrious");
  const lazy        = TRAITS.bad.find((t)  => t.name === "Lazy");
  console.assert(industrious.conflicts.includes("Lazy"),         "Industrious should conflict with Lazy");
  console.assert(lazy.conflicts.includes("Industrious"),         "Lazy should conflict with Industrious");
  const roll = generateRoll(els, () => {}, null);
  console.assert(roll === null || Array.isArray(roll),           "generateRoll should return array or null");
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
function init() {
  initTooltip();
  hydrateSharedRollFromHash();
  doRenderCurrentRoll();
  doRenderHistory();
  doRenderTraitReference();
  runSelfTests();
  setupMusicControls();

  // Start music on first interaction (respects browser autoplay policy)
  ["click", "keydown", "touchstart"].forEach((evt) => {
    document.addEventListener(evt, startMusicOnFirstInteraction, { once: true });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
