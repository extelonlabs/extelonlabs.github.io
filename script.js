function makeTrait(name, category, effect, description, stats = {}, tags = [], conflictGroups = []) {
  return {
    name,
    category,
    effect: effect || "No effect text added yet.",
    description: description || "No description added yet.",
    stats,
    tags,
    conflictGroups,
    conflicts: [],
    locked: false,
    lockId: null
  };
}

const TRAITS = {
  good: [
    makeTrait("Tough", "Good", "Damage taken x0.5 (50% reduction)", "Takes much less damage than normal.", {}, [], ["durability"]),
    makeTrait("Nimble", "Good", "+15 melee dodge chance", "Dodges melee attacks better than usual."),
    makeTrait("Quick sleeper", "Good", "Sleep need reduced ~50%", "Spends less time in bed and more time active."),
    makeTrait("Great memory", "Good", "Skill decay rate reduced", "Retains learned skills better over time."),
    makeTrait("Too smart", "Good", "+75% Global Learning Factor, mood risk", "Learns very fast, but is mentally less stable.", {}, [], ["learning", "nerves"]),
    makeTrait("Industrious", "Good", "+35% Global Work Speed", "Gets things done much faster than average.", {}, [], ["work"]),
    makeTrait("Hard worker", "Good", "+20% Global Work Speed", "A strong productivity boost.", {}, [], ["work"]),
    makeTrait("Jogger", "Good", "+0.4 cells/sec move speed", "Moves around the map quickly.", {}, [], ["speed"]),
    makeTrait("Fast walker", "Good", "+0.2 cells/sec move speed", "A smaller but useful movement boost.", {}, [], ["speed"]),
    makeTrait("Iron willed", "Good", "−18% Mental Break Threshold", "Less likely to break under pressure.", {}, [], ["nerves"]),
    makeTrait("Steadfast", "Good", "−9% Mental Break Threshold", "More stable than average.", {}, [], ["nerves"]),
    makeTrait("Super immune", "Good", "+30% Immunity Gain Speed", "Builds immunity faster than average.", {}, [], ["health"]),
    makeTrait("Brawler", "Good", "+4 melee hit chance, bad with ranged", "Good for melee-focused pawns, worse for ranged.", {}, [], ["ranged_style"]),
    makeTrait("Bloodlust", "Good", "Mood bonus after combat", "Violence-oriented trait; kept in Good because that is your category list.", {}, [], ["violence_style"]),
    makeTrait("Optimist", "Good", "+6 permanent mood", "Keeps a higher mood baseline.", {}, [], ["base_mood"])
  ],
  neutral: [
    makeTrait("Careful shooter", "Neutral", "Aiming Time +25%, Shooting Accuracy +5", "Shoots more carefully, usually slower but more accurately.", {}, [], ["ranged_style"]),
    makeTrait("Very neurotic", "Neutral", "Global Work Speed +40%, Mental Break Threshold +14%", "Very productive, but mentally fragile.", {}, [], ["neurotic", "nerves"]),
    makeTrait("Night owl", "Neutral", "+16 mood at night, −10 in daytime", "Works best on a night schedule."),
    makeTrait("Body modder", "Neutral", "+8 mood with body mods, unhappy without them", "Wants body modifications.", {}, [], ["body_ideology"]),
    makeTrait("Neurotic", "Neutral", "Global Work Speed +20%, Mental Break Threshold +8%", "Balanced positive and negative effects.", {}, [], ["neurotic", "nerves"]),
    makeTrait("Body purist", "Neutral", "Dislikes artificial body parts", "Prefers a natural body.", {}, [], ["body_ideology"]),
    makeTrait("Kind", "Neutral", "Reduced insult chance", "Less likely to insult others.", {}, [], ["social_style"]),
    makeTrait("Pretty", "Neutral", "+1 Pawn Beauty", "Improves how others view the pawn.", {}, [], ["beauty"]),
    makeTrait("Beautiful", "Neutral", "+2 Pawn Beauty", "Greatly improves social opinion.", {}, [], ["beauty"]),
    makeTrait("Masochist", "Neutral", "+10 mood when in pain", "Pain affects mood in unusual ways."),
    makeTrait("Undergrounder", "Neutral", "No cabin fever, indoor bonuses", "Works fine in mountain or indoor colonies."),
    makeTrait("Ascetic", "Neutral", "Simple living mood benefits", "Needs less luxury than most pawns.", {}, [], ["luxury"]),
    makeTrait("Cannibal", "Neutral", "Strong cannibal mood effects", "Strongly changes food and social behavior."),
    makeTrait("Tortured artist", "Neutral", "Random inspiration on mental break", "Unstable but can produce inspirations."),
    makeTrait("Creepy breathing", "Neutral", "−15 social opinion", "Others find this pawn unsettling."),
    makeTrait("Annoying voice", "Neutral", "−10 social opinion", "Others like them less."),
    makeTrait("Teetotaler", "Neutral", "Never uses recreational drugs", "Avoids recreational drugs willingly.", {}, [], ["drug_interest"]),
    makeTrait("Trigger happy", "Neutral", "Aiming Time −50%, Shooting Accuracy −5", "Shoots faster but less accurately.", {}, [], ["ranged_style"]),
    makeTrait("Ugly", "Neutral", "−1 Pawn Beauty", "Others tend to like them less.", {}, [], ["beauty"]),
    makeTrait("Staggeringly ugly", "Neutral", "−2 Pawn Beauty", "Severely hurts social opinion.", {}, [], ["beauty"]),
    makeTrait("Psychically hypersensitive", "Neutral", "+80% Psychic Sensitivity", "Very affected by psychic effects.", {}, [], ["psychic"]),
    makeTrait("Psychically sensitive", "Neutral", "+40% Psychic Sensitivity", "More affected by psychic effects.", {}, [], ["psychic"]),
    makeTrait("Psychically dull", "Neutral", "−50% Psychic Sensitivity", "Less affected by psychic effects.", {}, [], ["psychic"]),
    makeTrait("Psychically deaf", "Neutral", "−100% Psychic Sensitivity", "Mostly immune to psychic effects.", {}, [], ["psychic"]),
    makeTrait("Psychopath", "Neutral", "No mood penalty from corpses", "Less affected by many social penalties.", {}, [], ["social_style"])
  ],
  bad: [
    makeTrait("Pessimist", "Bad", "−6 permanent mood", "Lower mood baseline than average.", {}, [], ["base_mood"]),
    makeTrait("Nudist", "Bad", "+20 mood nude, −3 while clothed", "Harder to manage with normal apparel and armor."),
    makeTrait("Pyromaniac", "Bad", "Random fire-starting risk", "May start fires and will not firefight normally."),
    makeTrait("Wimp", "Bad", "Pain shock threshold −50%", "Drops from pain very easily.", {}, [], ["durability"]),
    makeTrait("Delicate", "Bad", "Damage taken x1.5", "More fragile in combat.", {}, [], ["durability"]),
    makeTrait("Slow learner", "Bad", "−75% Global Learning Factor", "Skills grow much more slowly.", {}, [], ["learning"]),
    makeTrait("Chemical fascination", "Bad", "Frequent drug binges", "High addiction and binge risk.", {}, [], ["drug_interest"]),
    makeTrait("Chemical interest", "Bad", "Occasional drug binges", "May use recreational drugs more often.", {}, [], ["drug_interest"]),
    makeTrait("Lazy", "Bad", "−20% Global Work Speed", "Gets jobs done more slowly.", {}, [], ["work"]),
    makeTrait("Slothful", "Bad", "−35% Global Work Speed", "Severe productivity penalty.", {}, [], ["work"]),
    makeTrait("Slow poke", "Bad", "−0.2 cells/sec move speed", "Movement-heavy jobs suffer.", {}, [], ["speed"]),
    makeTrait("Nervous", "Bad", "+8% Mental Break Threshold", "Breaks under stress more easily.", {}, [], ["nerves"]),
    makeTrait("Volatile", "Bad", "+15% Mental Break Threshold", "One of the worst stress traits.", {}, [], ["nerves"]),
    makeTrait("Sickly", "Bad", "Gets sick more often", "More medical trouble over time.", {}, [], ["health"]),
    makeTrait("Gourmand", "Bad", "Food binge mental breaks", "Can create food management problems."),
    makeTrait("Greedy", "Bad", "Needs impressive bedroom", "Needs better rooms or status items.", {}, [], ["luxury"]),
    makeTrait("Jealous", "Bad", "Needs best bedroom", "Can become unhappy if they do not get top status.", {}, [], ["luxury"]),
    makeTrait("Abrasive", "Bad", "Frequent social fights", "More likely to upset other pawns.", {}, [], ["social_style"])
  ]
};

const CONFLICT_GROUPS = {
  work: ["Industrious", "Hard worker", "Lazy", "Slothful"],
  speed: ["Jogger", "Fast walker", "Slow poke"],
  base_mood: ["Optimist", "Pessimist"],
  nerves: ["Iron willed", "Steadfast", "Nervous", "Volatile", "Too smart"],
  neurotic: ["Neurotic", "Very neurotic"],
  ranged_style: ["Careful shooter", "Trigger happy", "Brawler"],
  beauty: ["Beautiful", "Pretty", "Ugly", "Staggeringly ugly"],
  psychic: ["Psychically hypersensitive", "Psychically sensitive", "Psychically dull", "Psychically deaf"],
  health: ["Super immune", "Sickly"],
  body_ideology: ["Body modder", "Body purist"],
  luxury: ["Ascetic", "Greedy", "Jealous"],
  drug_interest: ["Teetotaler", "Chemical interest", "Chemical fascination"],
  durability: ["Tough", "Delicate", "Wimp"],
  social_style: ["Kind", "Abrasive", "Psychopath", "Bloodlust"],
  learning: ["Too smart", "Slow learner"],
  violence_style: ["Kind", "Bloodlust"]
};

function buildConflictMap() {
  const all = [...TRAITS.good, ...TRAITS.neutral, ...TRAITS.bad];
  const map = {};

  for (const trait of all) map[trait.name] = new Set();

  for (const trait of all) {
    for (const groupName of trait.conflictGroups || []) {
      for (const other of CONFLICT_GROUPS[groupName] || []) {
        if (other !== trait.name) map[trait.name].add(other);
      }
    }
  }

  for (const name of Object.keys(map)) {
    for (const other of [...map[name]]) {
      if (!map[other]) map[other] = new Set();
      map[other].add(name);
    }
  }

  for (const trait of all) {
    trait.conflicts = [...map[trait.name]].sort();
  }
}
buildConflictMap();

const STORAGE_KEY = "rimworld-trait-dice-history-v4";
let currentRoll = null;
let savedRolls = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let nextLockId = 1;

const currentRollEl = document.getElementById("currentRoll");
const historyListEl = document.getElementById("historyList");
const traitReferenceEl = document.getElementById("traitReference");
const chosenTraitsSummaryEl = document.getElementById("chosenTraitsSummary");
const totalCountEl = document.getElementById("totalCount");
const goodCountEl = document.getElementById("goodCount");
const neutralCountEl = document.getElementById("neutralCount");
const badCountEl = document.getElementById("badCount");
const statusAreaEl = document.getElementById("statusArea");
const referenceSearchEl = document.getElementById("referenceSearch");
const referenceFilterEl = document.getElementById("referenceFilter");
const tooltipEl = document.getElementById("tooltip");

function categoryClass(category) {
  return String(category || "").toLowerCase().replace(/\s+/g, "-");
}

function normalizeTrait(trait) {
  return {
    name: trait?.name || "Unknown trait",
    category: trait?.category || "Unknown",
    effect: trait?.effect || "No effect text added yet.",
    description: trait?.description || "No description added yet.",
    conflicts: Array.isArray(trait?.conflicts) ? trait.conflicts : [],
    locked: !!trait?.locked,
    lockId: trait?.lockId || null
  };
}

function sameTrait(a, b) {
  return normalizeTrait(a).name === normalizeTrait(b).name;
}

function conflictsWithAny(candidate, picked) {
  const c = normalizeTrait(candidate);
  for (const item of picked) {
    const p = normalizeTrait(item);
    if (c.name === p.name) return true;
    if (c.conflicts.includes(p.name)) return true;
    if (p.conflicts.includes(c.name)) return true;
  }
  return false;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function showStatus(message, type = "") {
  if (!message) {
    statusAreaEl.innerHTML = "";
    return;
  }
  statusAreaEl.innerHTML = `<div class="status-message ${type}">${message}</div>`;
}

function getBalancedCounts() {
  const total = Math.max(1, parseInt(totalCountEl.value, 10) || 3);
  let good = Math.max(0, parseInt(goodCountEl.value, 10) || 0);
  let neutral = Math.max(0, parseInt(neutralCountEl.value, 10) || 0);
  let bad = Math.max(0, parseInt(badCountEl.value, 10) || 0);

  if (good + neutral + bad !== total) {
    good = 0;
    neutral = 0;
    bad = 0;

    for (let i = 0; i < total; i++) {
      const r = Math.random();
      if (r < 0.34) good++;
      else if (r < 0.67) neutral++;
      else bad++;
    }

    goodCountEl.value = good;
    neutralCountEl.value = neutral;
    badCountEl.value = bad;
    showStatus("Category counts were auto-balanced to match Total traits.", "ok");
  }

  return { good, neutral, bad };
}

function getLockedByCategory() {
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

function pickForCategory(pool, neededCount, alreadyPicked, lockedAlreadyInCategory) {
  const chosen = lockedAlreadyInCategory.map(normalizeTrait);
  if (chosen.length > neededCount) return null;

  const available = shuffle(pool).filter((trait) => {
    return !chosen.some((c) => sameTrait(c, trait)) &&
           !alreadyPicked.some((c) => sameTrait(c, trait));
  });

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

function generateRoll() {
  const counts = getBalancedCounts();
  const locked = getLockedByCategory();

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

function traitTooltipHtml(trait) {
  return `
    <div class="tooltip-title">${trait.name}</div>
    <div class="tooltip-line"><strong>Category:</strong> ${trait.category}</div>
    <div class="tooltip-line"><strong>Effect:</strong> ${trait.effect}</div>
    <div class="tooltip-line"><strong>Conflicts:</strong> ${trait.conflicts.length ? trait.conflicts.join(", ") : "None mapped"}</div>
  `;
}

function showTooltip(html, x, y) {
  tooltipEl.innerHTML = html;
  tooltipEl.classList.remove("hidden");
  tooltipEl.style.left = `${Math.min(window.innerWidth - 340, x + 14)}px`;
  tooltipEl.style.top = `${Math.min(window.innerHeight - 180, y + 14)}px`;
}

function hideTooltip() {
  tooltipEl.classList.add("hidden");
}

function renderChosenTraitsSummary() {
  if (!currentRoll || !currentRoll.length) {
    chosenTraitsSummaryEl.innerHTML = '<div class="empty">Roll traits to see the full chosen-traits summary here.</div>';
    return;
  }

  chosenTraitsSummaryEl.innerHTML = `
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

function renderCurrentRoll(isAnimating = false) {
  if (!currentRoll || !currentRoll.length) {
    currentRollEl.innerHTML = '<div class="empty">Roll traits</div>';
    chosenTraitsSummaryEl.innerHTML = '<div class="empty">Roll traits to see the full chosen-traits summary here.</div>';
    return;
  }

  currentRollEl.innerHTML = currentRoll.map((rawTrait, index) => {
    const trait = normalizeTrait(rawTrait);
    const rollingClass = isAnimating ? "rolling" : "";
    const delay = isAnimating ? `style="animation-delay:${index * 120}ms; --roll-duration: 0.5s"` : "";

    return `
      <article class="trait-card ${trait.locked ? "locked" : ""} ${rollingClass}" data-card-id="${trait.lockId}" ${delay}>
        <div class="pill ${categoryClass(trait.category)}">${trait.category}</div>
        <div class="trait-name">${trait.name}</div>
        <div class="card-actions">
          <button class="ghost small-btn lock-btn" data-lock-id="${trait.lockId}">${trait.locked ? "🔒 Locked" : "🔓 Lock"}</button>
          <button class="secondary small-btn reroll-btn" data-reroll-id="${trait.lockId}">🔁 Reroll</button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".lock-btn").forEach((button) => {
    button.onclick = () => {
      const id = button.getAttribute("data-lock-id");
      let changedCardId = null;

      for (let i = 0; i < currentRoll.length; i++) {
        if (String(currentRoll[i].lockId) === String(id)) {
          currentRoll[i].locked = !currentRoll[i].locked;
          changedCardId = currentRoll[i].lockId;
          break;
        }
      }

      renderCurrentRoll(false);

      if (changedCardId !== null) {
        const card = document.querySelector(`[data-card-id="${changedCardId}"]`);
        if (card) {
          card.classList.add("lock-pulse");
          setTimeout(() => card.classList.remove("lock-pulse"), 450);
        }
      }

      showStatus("Updated trait lock state.", "ok");
    };
  });

  document.querySelectorAll(".reroll-btn").forEach((button) => {
    button.onclick = () => rerollSingleTrait(button.getAttribute("data-reroll-id"));
  });

  document.querySelectorAll(".trait-card").forEach((card) => {
    const trait = normalizeTrait(
      currentRoll.find((t) => String(t.lockId) === String(card.getAttribute("data-card-id")))
    );

    card.addEventListener("mouseenter", (e) => showTooltip(traitTooltipHtml(trait), e.clientX, e.clientY));
    card.addEventListener("mousemove", (e) => showTooltip(traitTooltipHtml(trait), e.clientX, e.clientY));
    card.addEventListener("mouseleave", hideTooltip);
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      showTooltip(traitTooltipHtml(trait), e.clientX, e.clientY);
    });
  });

  renderChosenTraitsSummary();
}

async function animateRoll(newRoll) {
  const total = newRoll.length;
  const allPools = { Good: TRAITS.good, Neutral: TRAITS.neutral, Bad: TRAITS.bad };

  if (!currentRoll || !currentRoll.length) {
    currentRoll = newRoll.map((t) => ({ ...normalizeTrait(t), locked: false }));
  }

  const frames = 18;
  const totalAnimationTime = 2200;
  let elapsedTime = 0;

  for (let frame = 0; frame < frames; frame++) {
    const progress = frame / (frames - 1);
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    const frameDelay = (easedProgress * totalAnimationTime) - elapsedTime;
    elapsedTime += frameDelay;

    const preview = [];

    for (let i = 0; i < total; i++) {
      const finalTrait = normalizeTrait(newRoll[i]);
      const existing = currentRoll[i] ? normalizeTrait(currentRoll[i]) : null;

      if (existing && existing.locked && existing.category === finalTrait.category) {
        preview.push(existing);
      } else {
        const pool = allPools[finalTrait.category] || [];
        const randomTrait = normalizeTrait(pool[Math.floor(Math.random() * pool.length)]);
        randomTrait.lockId = existing?.lockId || nextLockId++;
        preview.push(randomTrait);
      }
    }

    currentRoll = preview;
    renderCurrentRoll(true);
    await new Promise((resolve) => setTimeout(resolve, Math.max(10, frameDelay)));
  }

  const merged = [];
  for (let i = 0; i < newRoll.length; i++) {
    const finalTrait = normalizeTrait(newRoll[i]);
    const old = currentRoll[i] ? normalizeTrait(currentRoll[i]) : null;
    finalTrait.locked = !!old?.locked && old?.name === finalTrait.name;
    finalTrait.lockId = old?.lockId || nextLockId++;
    merged.push(finalTrait);
  }

  currentRoll = merged;
  renderCurrentRoll(true);

  setTimeout(() => {
    renderCurrentRoll(false);
    renderTraitReference();
  }, 520);
}

function rerollSingleTrait(lockId) {
  if (!currentRoll) return;

  const existing = currentRoll.map(normalizeTrait);
  const index = existing.findIndex((t) => String(t.lockId) === String(lockId));
  if (index === -1) return;

  const target = existing[index];
  const sameCategoryPool =
    target.category === "Good" ? TRAITS.good :
    target.category === "Neutral" ? TRAITS.neutral :
    TRAITS.bad;

  const pickedWithoutTarget = existing.filter((_, i) => i !== index);

  const available = shuffle(sameCategoryPool)
    .map(normalizeTrait)
    .filter((candidate) => {
      if (sameTrait(candidate, target)) return false;
      if (pickedWithoutTarget.some((p) => sameTrait(p, candidate))) return false;
      return !conflictsWithAny(candidate, pickedWithoutTarget);
    });

  if (!available.length) {
    showStatus("No valid reroll found for that trait without causing a conflict.", "error");
    return;
  }

  const audio = new Audio("Soundeffects/reroll.mp3");
  audio.volume = 0.7;
  audio.play().catch((e) => console.log("Audio play failed:", e));

  animateRerollSingle(lockId, available[0], target);
}

async function animateRerollSingle(lockId, finalTrait, originalTrait) {
  const card = document.querySelector(`[data-card-id="${lockId}"]`);
  if (!card) return;

  const sameCategoryPool =
    originalTrait.category === "Good" ? TRAITS.good :
    originalTrait.category === "Neutral" ? TRAITS.neutral :
    TRAITS.bad;

  card.classList.add("rerolling");

  const frameTimes = [
    0, 50, 105, 165, 230, 300, 380, 470, 570, 680,
    800, 935, 1085, 1250, 1430, 1625, 1835, 2060, 2300, 2560,
    2880, 3070, 3270, 3480, 3700, 3930, 4170, 4420, 4690, 5000,
    5180, 5400, 5660, 5960, 6300, 6300
  ];

  const start = performance.now();

  for (let frame = 0; frame < frameTimes.length; frame++) {
    const randomTrait = normalizeTrait(
      sameCategoryPool[Math.floor(Math.random() * sameCategoryPool.length)]
    );
    randomTrait.lockId = lockId;

    const pillEl = card.querySelector(".pill");
    const nameEl = card.querySelector(".trait-name");

    if (pillEl) pillEl.textContent = randomTrait.category;
    if (nameEl) nameEl.textContent = randomTrait.name;

    card.className = card.className.replace(/good|neutral|bad/g, "");
    card.classList.add(categoryClass(randomTrait.category));

    const targetTime = start + frameTimes[frame];
    const wait = Math.max(0, targetTime - performance.now());
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const pillEl = card.querySelector(".pill");
  const nameEl = card.querySelector(".trait-name");

  if (pillEl) pillEl.textContent = finalTrait.category;
  if (nameEl) nameEl.textContent = finalTrait.name;

  card.className = card.className.replace(/good|neutral|bad/g, "");
  card.classList.add(categoryClass(finalTrait.category));

  const updated = currentRoll.map(normalizeTrait);
  const foundIndex = updated.findIndex((t) => String(t.lockId) === String(lockId));

  if (foundIndex !== -1) {
    finalTrait.locked = false;
    finalTrait.lockId = lockId;
    updated[foundIndex] = finalTrait;
    currentRoll = updated;
  }

  setTimeout(() => {
    card.classList.remove("rerolling");
    renderCurrentRoll(false);
    renderTraitReference();
    showStatus(`Rerolled ${originalTrait.name} into ${finalTrait.name}.`, "ok");
  }, 300);
}

function renderHistory() {
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
      <div class="history-tags">${entry.map((t) => `<span class="history-tag">${normalizeTrait(t).name}</span>`).join("")}</div>
      <div class="history-details">
        ${entry.map((raw) => {
          const trait = normalizeTrait(raw);
          return `<div class="ref-line"><strong>${trait.name}</strong> — ${trait.effect}</div>`;
        }).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".history-head").forEach((head) => {
    head.onclick = () => head.parentElement.classList.toggle("open");
  });
}

function renderTraitReference() {
  const search = referenceSearchEl.value.trim().toLowerCase();
  const filter = referenceFilterEl.value;
  const groups = [
    ["Good", TRAITS.good],
    ["Neutral", TRAITS.neutral],
    ["Bad", TRAITS.bad]
  ];

  const currentRollNames = currentRoll ? currentRoll.map((t) => normalizeTrait(t).name) : [];

  const filteredGroups = groups
    .map(([label, items]) => {
      const filteredItems = items.filter((raw) => {
        const trait = normalizeTrait(raw);
        const matchFilter = filter === "all" || trait.category === filter;
        const matchSearch =
          !search ||
          trait.name.toLowerCase().includes(search) ||
          trait.description.toLowerCase().includes(search) ||
          trait.effect.toLowerCase().includes(search) ||
          trait.conflicts.some((c) => c.toLowerCase().includes(search));

        return matchFilter && matchSearch;
      });

      return [label, filteredItems];
    })
    .filter(([, items]) => items.length);

  if (!filteredGroups.length) {
    traitReferenceEl.innerHTML = '<div class="empty">No traits match your current search/filter.</div>';
    return;
  }

  traitReferenceEl.innerHTML = filteredGroups.map(([label, items]) => `
    <div class="reference-group">
      <h3>${label} traits</h3>
      <div class="reference-list">
        ${items.map((raw) => {
          const trait = normalizeTrait(raw);
          const isInCurrentRoll = currentRollNames.includes(trait.name);
          const glowClass = isInCurrentRoll ? "reference-item-glow" : "";

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

function persistHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRolls));
}

function currentRollText() {
  if (!currentRoll || !currentRoll.length) return "No traits rolled.";

  return currentRoll.map((raw) => {
    const t = normalizeTrait(raw);
    return `${t.category}: ${t.name} — ${t.effect}`;
  }).join("\n");
}

function applyPreset(name) {
  const presets = {
    balanced: { total: 3, good: 1, neutral: 1, bad: 1 },
    lucky: { total: 4, good: 3, neutral: 1, bad: 0 },
    cursed: { total: 4, good: 0, neutral: 1, bad: 3 },
    chaos: { total: 5, good: 2, neutral: 1, bad: 2 },
    minmax: { total: 4, good: 2, neutral: 0, bad: 2 }
  };

  const preset = presets[name];
  if (!preset) return;

  totalCountEl.value = preset.total;
  goodCountEl.value = preset.good;
  neutralCountEl.value = preset.neutral;
  badCountEl.value = preset.bad;

  showStatus(`Applied preset: ${name}.`, "ok");
}

document.getElementById("rollBtn").onclick = async () => {
  const nextRoll = generateRoll();

  if (!nextRoll) {
    showStatus("Could not generate a non-conflicting roll with those settings. Try fewer traits or reduce locked traits.", "error");
    return;
  }

  showStatus("Rolling traits...", "ok");
  await animateRoll(nextRoll.map((t) => ({ ...normalizeTrait(t), lockId: nextLockId++ })));
  showStatus("Roll complete.", "ok");
};

document.getElementById("saveBtn").onclick = () => {
  if (!currentRoll || !currentRoll.length) return;

  savedRolls.push(currentRoll.map(normalizeTrait));
  persistHistory();
  renderHistory();
  showStatus("Saved current roll.", "ok");
};

document.getElementById("copyBtn").onclick = async () => {
  try {
    await navigator.clipboard.writeText(currentRollText());
    showStatus("Copied current roll to clipboard.", "ok");
  } catch {
    showStatus("Could not copy automatically. Your browser blocked clipboard access.", "error");
  }
};

document.getElementById("shareBtn").onclick = async () => {
  if (!currentRoll || !currentRoll.length) {
    showStatus("Roll traits first before creating a share link.", "error");
    return;
  }

  const payload = encodeURIComponent(btoa(JSON.stringify(currentRoll.map(normalizeTrait))));
  const url = `${location.origin}${location.pathname}#roll=${payload}`;

  try {
    await navigator.clipboard.writeText(url);
    showStatus("Share link copied to clipboard.", "ok");
  } catch {
    showStatus(url, "ok");
  }
};

document.getElementById("clearBtn").onclick = () => {
  currentRoll = null;
  renderCurrentRoll();
  showStatus("Cleared current roll.", "ok");
};

document.getElementById("resetBtn").onclick = () => {
  currentRoll = null;
  savedRolls = [];
  totalCountEl.value = 3;
  goodCountEl.value = 1;
  neutralCountEl.value = 1;
  badCountEl.value = 1;
  persistHistory();
  renderCurrentRoll();
  renderHistory();
  showStatus("Reset current roll, saves, and settings.", "ok");
};

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.onclick = () => applyPreset(btn.getAttribute("data-preset"));
});

referenceSearchEl.addEventListener("input", renderTraitReference);
referenceFilterEl.addEventListener("change", renderTraitReference);

function hydrateSharedRollFromHash() {
  if (!location.hash.startsWith("#roll=")) return;

  try {
    const encoded = location.hash.slice(6);
    const parsed = JSON.parse(atob(decodeURIComponent(encoded)));
    currentRoll = parsed.map((t) => ({ ...normalizeTrait(t), lockId: nextLockId++ }));
    renderCurrentRoll();
    showStatus("Loaded shared roll from URL.", "ok");
  } catch {
    showStatus("Could not load shared roll from URL.", "error");
  }
}

function runSelfTests() {
  const industrious = TRAITS.good.find((t) => t.name === "Industrious");
  const lazy = TRAITS.bad.find((t) => t.name === "Lazy");

  console.assert(industrious.conflicts.includes("Lazy"), "Industrious should conflict with Lazy");
  console.assert(lazy.conflicts.includes("Industrious"), "Lazy should conflict with Industrious");

  const roll = generateRoll();
  console.assert(roll === null || Array.isArray(roll), "generateRoll should return array or null");
}

/* =========================
   BACKGROUND MUSIC
   Improved version:
   - no autoplay on page load
   - starts only after user interaction
   - remembers volume with localStorage
   - smooth fade-in when music starts
========================= */

const MUSIC_VOLUME_KEY = "rimworld-music-volume";
const musicPlaylist = [
  "Soundeffects/music1.mp3",
  "Soundeffects/music2.mp3",
  "Soundeffects/music3.mp3"
];

let backgroundMusic = null;
let currentTrackIndex = 0;
let musicStartedOnce = false;
let fadeInterval = null;

function getSavedVolume() {
  const saved = localStorage.getItem(MUSIC_VOLUME_KEY);
  const parsed = Number(saved);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
    return parsed;
  }
  return 10; // default starting volume %
}

function saveVolume(volumePercent) {
  localStorage.setItem(MUSIC_VOLUME_KEY, String(volumePercent));
}

function createBackgroundAudio(index = 0) {
  const audio = new Audio(musicPlaylist[index]);
  audio.preload = "auto";
  audio.volume = 0;

  audio.addEventListener("ended", async () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
    backgroundMusic = createBackgroundAudio(currentTrackIndex);

    try {
      await backgroundMusic.play();
      fadeInMusic(backgroundMusic, getSavedVolume(), 1200);
      updateMusicButtons(true);
    } catch (error) {
      console.warn("Background music play failed:", error);
      updateMusicButtons(false);
    }
  });

  return audio;
}

function ensureBackgroundAudio() {
  if (!backgroundMusic) {
    backgroundMusic = createBackgroundAudio(currentTrackIndex);
  }
}

function clearFadeInterval() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function fadeInMusic(audio, targetVolumePercent, duration = 1000) {
  clearFadeInterval();

  const targetVolume = Math.max(0, Math.min(1, targetVolumePercent / 100));
  const steps = 20;
  const stepDuration = Math.max(20, Math.floor(duration / steps));
  let currentStep = 0;

  audio.volume = 0;

  fadeInterval = setInterval(() => {
    currentStep += 1;
    audio.volume = targetVolume * (currentStep / steps);

    if (currentStep >= steps) {
      audio.volume = targetVolume;
      clearFadeInterval();
    }
  }, stepDuration);
}

async function playBackgroundMusic() {
  ensureBackgroundAudio();

  try {
    await backgroundMusic.play();
    musicStartedOnce = true;
    fadeInMusic(backgroundMusic, getSavedVolume(), 1200);
    updateMusicButtons(true);
  } catch (error) {
    console.warn("Background music play failed:", error);
    updateMusicButtons(false);
  }
}

function stopBackgroundMusic() {
  if (!backgroundMusic) return;

  clearFadeInterval();
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  backgroundMusic.volume = 0;
  updateMusicButtons(false);
}

function setMusicVolume(volumePercent) {
  const clamped = Math.max(0, Math.min(100, volumePercent));
  saveVolume(clamped);

  if (backgroundMusic) {
    backgroundMusic.volume = clamped / 100;
  }

  const volumeLabel = document.getElementById("volumeLabel");
  if (volumeLabel) {
    volumeLabel.textContent = `${clamped}%`;
  }
}

function updateMusicButtons(isPlaying) {
  const playBtn = document.getElementById("playMusicBtn");
  const stopBtn = document.getElementById("stopMusicBtn");

  if (playBtn) playBtn.style.opacity = isPlaying ? "0.6" : "1";
  if (stopBtn) stopBtn.style.opacity = isPlaying ? "1" : "0.6";
}

function setupMusicControls() {
  const playBtn = document.getElementById("playMusicBtn");
  const stopBtn = document.getElementById("stopMusicBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeLabel = document.getElementById("volumeLabel");
  const savedVolume = getSavedVolume();

  ensureBackgroundAudio();

  if (volumeSlider) {
    volumeSlider.value = String(savedVolume);
  }

  if (volumeLabel) {
    volumeLabel.textContent = `${savedVolume}%`;
  }

  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      await playBackgroundMusic();
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      stopBackgroundMusic();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      const value = Number(volumeSlider.value);
      setMusicVolume(value);
    });
  }
}

function startMusicOnFirstInteraction() {
  if (musicStartedOnce) return;

  playBackgroundMusic();

  document.removeEventListener("click", startMusicOnFirstInteraction);
  document.removeEventListener("keydown", startMusicOnFirstInteraction);
  document.removeEventListener("touchstart", startMusicOnFirstInteraction);
}

/* Optional:
   starts music on the FIRST click or key press anywhere,
   but still respects browser rules because it is user interaction.
*/
function startMusicOnFirstInteraction() {
  if (musicStartedOnce) return;

  playBackgroundMusic();

  document.removeEventListener("click", startMusicOnFirstInteraction);
  document.removeEventListener("keydown", startMusicOnFirstInteraction);
  document.removeEventListener("touchstart", startMusicOnFirstInteraction);
}

function init() {
  hydrateSharedRollFromHash();
  renderCurrentRoll();
  renderHistory();
  renderTraitReference();
  runSelfTests();
  setupMusicControls();
  updateMusicButtons(false);

  document.addEventListener("click", startMusicOnFirstInteraction, { once: true });
  document.addEventListener("keydown", startMusicOnFirstInteraction, { once: true });
  document.addEventListener("touchstart", startMusicOnFirstInteraction, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
