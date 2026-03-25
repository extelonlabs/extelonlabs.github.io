function makeTrait(name, category, effect, description, conflicts) {
  return {
    name,
    category,
    effect: effect || 'No effect text added yet.',
    description: description || 'No description added yet.',
    conflicts: Array.isArray(conflicts) ? conflicts : []
  };
}

/*
  Wiki-style conflict logic encoded for the traits included in this app.
  This is the important part for your use case:
  the roller blocks mutually exclusive/spectrum traits before you apply the chosen traits in game.
*/
const TRAITS = {
  good: [
    makeTrait('Tough', 'Good', 'Damage taken x0.5 (50% reduction)', 'Takes much less damage than normal.', ['Delicate', 'Wimp']),
    makeTrait('Nimble', 'Good', '+15 melee dodge chance', 'Dodges melee attacks better than usual.', []),
    makeTrait('Quick sleeper', 'Good', 'Sleep need reduced ~50%', 'Spends less time in bed and more time active.', []),
    makeTrait('Great memory', 'Good', 'Skill decay rate reduced', 'Retains learned skills better over time.', []),
    makeTrait('Too smart', 'Good', '+75% Global Learning Factor', 'Learns very fast, but is mentally less stable.', ['Slow learner', 'Iron willed', 'Steadfast', 'Nervous', 'Volatile']),
    makeTrait('Industrious', 'Good', '+35% Global Work Speed', 'Gets things done much faster than average.', ['Hard worker', 'Lazy', 'Slothful']),
    makeTrait('Hard worker', 'Good', '+20% Global Work Speed', 'A strong productivity boost.', ['Industrious', 'Lazy', 'Slothful']),
    makeTrait('Jogger', 'Good', '+0.4 cells/sec move speed', 'Moves around the map quickly.', ['Fast walker', 'Slow poke']),
    makeTrait('Fast walker', 'Good', '+0.2 cells/sec move speed', 'A smaller but useful movement boost.', ['Jogger', 'Slow poke']),
    makeTrait('Iron willed', 'Good', '−18% Mental Break Threshold', 'Less likely to break under pressure.', ['Steadfast', 'Nervous', 'Volatile', 'Too smart']),
    makeTrait('Steadfast', 'Good', '−9% Mental Break Threshold', 'More stable than average.', ['Iron willed', 'Nervous', 'Volatile', 'Too smart']),
    makeTrait('Super immune', 'Good', '+30% Immunity Gain Speed', 'Builds immunity faster than average.', ['Sickly']),
    makeTrait('Brawler', 'Good', '+4 melee hit chance, bad with ranged', 'Good for melee-focused pawns, worse for ranged.', ['Careful shooter', 'Trigger happy']),
    makeTrait('Bloodlust', 'Good', 'Mood bonus after combat', 'Violence-oriented trait; kept in Good because that is your category list.', ['Kind']),
    makeTrait('Optimist', 'Good', '+6 permanent mood', 'Keeps a higher mood baseline.', ['Pessimist'])
  ],

  neutral: [
    makeTrait('Careful shooter', 'Neutral', 'Aiming Time +25%, Shooting Accuracy +5', 'Shoots more carefully, usually slower but more accurately.', ['Trigger happy', 'Brawler']),
    makeTrait('Very neurotic', 'Neutral', 'Global Work Speed +40%, Mental Break Threshold +14%', 'Very productive, but mentally fragile.', ['Neurotic', 'Iron willed', 'Steadfast', 'Volatile', 'Nervous']),
    makeTrait('Night owl', 'Neutral', '+16 mood at night, −10 in daytime', 'Works best on a night schedule.', []),
    makeTrait('Body modder', 'Neutral', '+8 mood with body mods, unhappy without them', 'Wants body modifications.', ['Body purist']),
    makeTrait('Neurotic', 'Neutral', 'Global Work Speed +20%, Mental Break Threshold +8%', 'Balanced positive and negative effects.', ['Very neurotic', 'Iron willed', 'Steadfast', 'Volatile', 'Nervous']),
    makeTrait('Body purist', 'Neutral', 'Dislikes artificial body parts', 'Prefers a natural body.', ['Body modder']),
    makeTrait('Kind', 'Neutral', 'Reduced insult chance', 'Less likely to insult others.', ['Bloodlust', 'Abrasive', 'Psychopath']),
    makeTrait('Pretty', 'Neutral', '+1 Pawn Beauty', 'Improves how others view the pawn.', ['Beautiful', 'Ugly', 'Staggeringly ugly']),
    makeTrait('Beautiful', 'Neutral', '+2 Pawn Beauty', 'Greatly improves social opinion.', ['Pretty', 'Ugly', 'Staggeringly ugly']),
    makeTrait('Masochist', 'Neutral', '+10 mood when in pain', 'Pain affects mood in unusual ways.', []),
    makeTrait('Undergrounder', 'Neutral', 'No cabin fever, indoor bonuses', 'Works fine in mountain or indoor colonies.', []),
    makeTrait('Ascetic', 'Neutral', 'Simple living mood benefits', 'Needs less luxury than most pawns.', ['Greedy', 'Jealous']),
    makeTrait('Cannibal', 'Neutral', 'Strong cannibal mood effects', 'Strongly changes food and social behavior.', []),
    makeTrait('Tortured artist', 'Neutral', 'Random inspiration on mental break', 'Unstable but can produce inspirations.', []),
    makeTrait('Creepy breathing', 'Neutral', '−15 social opinion', 'Others find this pawn unsettling.', []),
    makeTrait('Annoying voice', 'Neutral', '−10 social opinion', 'Others like them less.', []),
    makeTrait('Teetotaler', 'Neutral', 'Never uses recreational drugs', 'Avoids recreational drugs willingly.', ['Chemical interest', 'Chemical fascination']),
    makeTrait('Trigger happy', 'Neutral', 'Aiming Time −50%, Shooting Accuracy −5', 'Shoots faster but less accurately.', ['Careful shooter', 'Brawler']),
    makeTrait('Ugly', 'Neutral', '−1 Pawn Beauty', 'Others tend to like them less.', ['Beautiful', 'Pretty', 'Staggeringly ugly']),
    makeTrait('Staggeringly ugly', 'Neutral', '−2 Pawn Beauty', 'Severely hurts social opinion.', ['Beautiful', 'Pretty', 'Ugly']),
    makeTrait('Psychically hypersensitive', 'Neutral', '+80% Psychic Sensitivity', 'Very affected by psychic effects.', ['Psychically sensitive', 'Psychically dull', 'Psychically deaf']),
    makeTrait('Psychically sensitive', 'Neutral', '+40% Psychic Sensitivity', 'More affected by psychic effects.', ['Psychically hypersensitive', 'Psychically dull', 'Psychically deaf']),
    makeTrait('Psychically dull', 'Neutral', '−50% Psychic Sensitivity', 'Less affected by psychic effects.', ['Psychically hypersensitive', 'Psychically sensitive', 'Psychically deaf']),
    makeTrait('Psychically deaf', 'Neutral', '−100% Psychic Sensitivity', 'Mostly immune to psychic effects.', ['Psychically hypersensitive', 'Psychically sensitive', 'Psychically dull']),
    makeTrait('Psychopath', 'Neutral', 'No mood penalty from corpses', 'Less affected by many social penalties.', ['Kind'])
  ],

  bad: [
    makeTrait('Pessimist', 'Bad', '−6 permanent mood', 'Lower mood baseline than average.', ['Optimist']),
    makeTrait('Nudist', 'Bad', '+20 mood nude, −3 while clothed', 'Harder to manage with normal apparel and armor.', []),
    makeTrait('Pyromaniac', 'Bad', 'Random fire-starting risk', 'May start fires and will not firefight normally.', []),
    makeTrait('Wimp', 'Bad', 'Pain shock threshold −50%', 'Drops from pain very easily.', ['Tough', 'Delicate']),
    makeTrait('Delicate', 'Bad', 'Damage taken x1.5', 'More fragile in combat.', ['Tough', 'Wimp']),
    makeTrait('Slow learner', 'Bad', '−75% Global Learning Factor', 'Skills grow much more slowly.', ['Too smart']),
    makeTrait('Chemical fascination', 'Bad', 'Frequent drug binges', 'High addiction and binge risk.', ['Teetotaler', 'Chemical interest']),
    makeTrait('Chemical interest', 'Bad', 'Occasional drug binges', 'May use recreational drugs more often.', ['Teetotaler', 'Chemical fascination']),
    makeTrait('Lazy', 'Bad', '−20% Global Work Speed', 'Gets jobs done more slowly.', ['Industrious', 'Hard worker', 'Slothful']),
    makeTrait('Slothful', 'Bad', '−35% Global Work Speed', 'Severe productivity penalty.', ['Industrious', 'Hard worker', 'Lazy']),
    makeTrait('Slow poke', 'Bad', '−0.2 cells/sec move speed', 'Movement-heavy jobs suffer.', ['Jogger', 'Fast walker']),
    makeTrait('Nervous', 'Bad', '+8% Mental Break Threshold', 'Breaks under stress more easily.', ['Iron willed', 'Steadfast', 'Neurotic', 'Very neurotic', 'Too smart', 'Volatile']),
    makeTrait('Volatile', 'Bad', '+15% Mental Break Threshold', 'One of the worst stress traits.', ['Iron willed', 'Steadfast', 'Neurotic', 'Very neurotic', 'Too smart', 'Nervous']),
    makeTrait('Sickly', 'Bad', 'Gets sick more often', 'More medical trouble over time.', ['Super immune']),
    makeTrait('Gourmand', 'Bad', 'Food binge mental breaks', 'Can create food management problems.', []),
    makeTrait('Greedy', 'Bad', 'Needs impressive bedroom', 'Needs better rooms or status items.', ['Ascetic', 'Jealous']),
    makeTrait('Jealous', 'Bad', 'Needs best bedroom', 'Can become unhappy if they do not get top status.', ['Ascetic', 'Greedy']),
    makeTrait('Abrasive', 'Bad', 'Frequent social fights', 'More likely to upset other pawns.', ['Kind'])
  ]
};

const STORAGE_KEY = 'rimworld-trait-dice-history-final';
let currentRoll = null;
let savedRolls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let nextLockId = 1;

const currentRollEl = document.getElementById('currentRoll');
const historyListEl = document.getElementById('historyList');
const traitReferenceEl = document.getElementById('traitReference');
const chosenTraitsSummaryEl = document.getElementById('chosenTraitsSummary');
const totalCountEl = document.getElementById('totalCount');
const goodCountEl = document.getElementById('goodCount');
const neutralCountEl = document.getElementById('neutralCount');
const badCountEl = document.getElementById('badCount');

function categoryClass(category) {
  return String(category || '').toLowerCase().replace(/\s+/g, '-');
}

function normalizeTrait(trait) {
  return {
    name: trait?.name || 'Unknown trait',
    category: trait?.category || 'Unknown',
    effect: trait?.effect || 'No effect text added yet.',
    description: trait?.description || 'No description added yet.',
    conflicts: Array.isArray(trait?.conflicts) ? trait.conflicts : [],
    locked: !!trait?.locked,
    lockId: trait?.lockId || null
  };
}

function sameTrait(a, b) {
  return normalizeTrait(a).name === normalizeTrait(b).name;
}

function conflictsWithAny(candidate, picked) {
  const safeCandidate = normalizeTrait(candidate);

  for (const item of picked) {
    const safeItem = normalizeTrait(item);
    if (safeCandidate.name === safeItem.name) return true;
    if (safeCandidate.conflicts.includes(safeItem.name)) return true;
    if (safeItem.conflicts.includes(safeCandidate.name)) return true;
  }

  return false;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getBalancedCounts() {
  const total = Math.max(1, parseInt(totalCountEl.value) || 3);
  let good = Math.max(0, parseInt(goodCountEl.value) || 0);
  let neutral = Math.max(0, parseInt(neutralCountEl.value) || 0);
  let bad = Math.max(0, parseInt(badCountEl.value) || 0);

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
    return !chosen.some(c => sameTrait(c, trait)) &&
           !alreadyPicked.some(c => sameTrait(c, trait));
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

  for (let attempt = 0; attempt < 300; attempt++) {
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

function renderCurrentRoll() {
  if (!currentRoll || !currentRoll.length) {
    currentRollEl.innerHTML = '<div class="empty">Roll traits</div>';
    chosenTraitsSummaryEl.innerHTML = '<div class="empty">Roll traits to see the full chosen-traits summary here.</div>';
    return;
  }

  currentRollEl.innerHTML = currentRoll.map((rawTrait) => {
    const trait = normalizeTrait(rawTrait);
    return `
      <article class="trait-card">
        <div class="pill ${categoryClass(trait.category)}">${trait.category}</div>
        <div class="trait-name">${trait.name}</div>
        <button class="ghost lock-btn" data-lock-id="${trait.lockId}">
          ${trait.locked ? '🔒 Locked' : '🔓 Lock trait'}
        </button>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.lock-btn').forEach((button) => {
    button.onclick = () => {
      const id = button.getAttribute('data-lock-id');
      for (let i = 0; i < currentRoll.length; i++) {
        if (String(currentRoll[i].lockId) === String(id)) {
          currentRoll[i].locked = !currentRoll[i].locked;
          break;
        }
      }
      renderCurrentRoll();
    };
  });

  renderChosenTraitsSummary();
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
            <div class="chosen-line"><strong>Conflict list:</strong> ${trait.conflicts.length ? trait.conflicts.join(', ') : 'None mapped'}</div>
            <div class="chosen-line"><strong>Locked:</strong> ${trait.locked ? 'Yes' : 'No'}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderHistory() {
  if (!savedRolls.length) {
    historyListEl.innerHTML = '<div class="empty">No saves</div>';
    return;
  }

  historyListEl.innerHTML = savedRolls.slice().reverse().map((entry, idx) => `
    <div class="history-item">
      <div style="margin-bottom:8px;font-weight:700;">Saved roll #${savedRolls.length - idx}</div>
      <div class="history-tags">
        ${entry.map(t => `<span class="history-tag">${normalizeTrait(t).name}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderTraitReference() {
  const groups = [['Good', TRAITS.good], ['Neutral', TRAITS.neutral], ['Bad', TRAITS.bad]];

  traitReferenceEl.innerHTML = groups.map(([label, items]) => `
    <div class="reference-group">
      <h3>${label} traits</h3>
      <div class="reference-list">
        ${items.map((raw) => {
          const trait = normalizeTrait(raw);
          return `
            <div class="reference-item">
              <strong>${trait.name}</strong>
              <div class="ref-line"><strong>Explanation:</strong> ${trait.description}</div>
              <div class="ref-line"><strong>Buff / Effect:</strong> ${trait.effect}</div>
              <div class="ref-line"><strong>Conflicts:</strong> ${trait.conflicts.length ? trait.conflicts.join(', ') : 'None mapped'}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function persistHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRolls));
}

document.getElementById('rollBtn').onclick = () => {
  const nextRoll = generateRoll();
  if (!nextRoll) {
    alert('Could not generate a non-conflicting roll with those settings. Try fewer traits or reduce locked traits.');
    return;
  }
  currentRoll = nextRoll;
  renderCurrentRoll();
};

document.getElementById('saveBtn').onclick = () => {
  if (!currentRoll || !currentRoll.length) return;
  savedRolls.push(currentRoll.map(normalizeTrait));
  persistHistory();
  renderHistory();
};

document.getElementById('clearBtn').onclick = () => {
  currentRoll = null;
  renderCurrentRoll();
};

document.getElementById('resetBtn').onclick = () => {
  currentRoll = null;
  savedRolls = [];
  totalCountEl.value = 3;
  goodCountEl.value = 1;
  neutralCountEl.value = 1;
  badCountEl.value = 1;
  persistHistory();
  renderCurrentRoll();
  renderHistory();
};

function runSelfTests() {
  console.assert(
    conflictsWithAny(
      makeTrait('Optimist', 'Good', '', '', ['Pessimist']),
      [makeTrait('Pessimist', 'Bad', '', '', [])]
    ) === true,
    'Optimist should conflict with Pessimist'
  );

  console.assert(
    conflictsWithAny(
      makeTrait('Industrious', 'Good', '', '', ['Lazy']),
      [makeTrait('Lazy', 'Bad', '', '', [])]
    ) === true,
    'Industrious should conflict with Lazy'
  );

  const roll = generateRoll();
  console.assert(roll === null || Array.isArray(roll), 'generateRoll should return array or null');
}

runSelfTests();
renderCurrentRoll();
renderHistory();
renderTraitReference();
