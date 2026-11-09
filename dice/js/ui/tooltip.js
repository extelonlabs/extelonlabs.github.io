/**
 * tooltip.js
 * Lightweight tooltip: show on hover, hide on leave.
 */

import { normalizeTrait } from "../core/utils.js";

let tooltipEl = null;

export function initTooltip() {
  tooltipEl = document.getElementById("tooltip");
}

export function traitTooltipHtml(trait) {
  const t = normalizeTrait(trait);
  return `
    <div class="tooltip-title">${t.name}</div>
    <div class="tooltip-line"><strong>Category:</strong> ${t.category}</div>
    <div class="tooltip-line"><strong>Effect:</strong> ${t.effect}</div>
    <div class="tooltip-line"><strong>Conflicts:</strong> ${t.conflicts.length ? t.conflicts.join(", ") : "None mapped"}</div>
  `;
}

export function showTooltip(html, x, y) {
  if (!tooltipEl) return;
  tooltipEl.innerHTML = html;
  tooltipEl.classList.remove("hidden");
  tooltipEl.style.left = `${Math.min(window.innerWidth  - 340, x + 14)}px`;
  tooltipEl.style.top  = `${Math.min(window.innerHeight - 180, y + 14)}px`;
}

export function hideTooltip() {
  tooltipEl?.classList.add("hidden");
}
