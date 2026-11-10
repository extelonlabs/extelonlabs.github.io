/**
 * traits.js
 * All trait definitions and conflict group data.
 * To add a new trait: call makeTrait() and push it into the correct array.
 * To add a new conflict group: add an entry to CONFLICT_GROUPS and reference
 * its key in the conflictGroups array of any relevant makeTrait() calls.
 */

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

// ---------------------------------------------------------------------------
// CONFLICT GROUPS
// Traits in the same group cannot appear together in a single roll.
// ---------------------------------------------------------------------------
export const CONFLICT_GROUPS = {
  work:           ["Industrious", "Hard worker", "Lazy", "Slothful"],
  speed:          ["Jogger", "Fast walker", "Slow poke"],
  base_mood:      ["Optimist", "Pessimist"],
  nerves:         ["Iron willed", "Steadfast", "Nervous", "Volatile", "Too smart"],
  neurotic:       ["Neurotic", "Very neurotic"],
  ranged_style:   ["Careful shooter", "Trigger happy", "Brawler"],
  beauty:         ["Beautiful", "Pretty", "Ugly", "Staggeringly ugly"],
  psychic:        ["Psychically hypersensitive", "Psychically sensitive", "Psychically dull", "Psychically deaf"],
  health:         ["Super immune", "Sickly"],
  body_ideology:  ["Body modder", "Body purist"],
  luxury:         ["Ascetic", "Greedy", "Jealous"],
  drug_interest:  ["Teetotaler", "Chemical interest", "Chemical fascination"],
  durability:     ["Tough", "Delicate", "Wimp"],
  social_style:   ["Kind", "Abrasive", "Psychopath", "Bloodlust"],
  learning:       ["Too smart", "Slow learner"],
  violence_style: ["Kind", "Bloodlust"]
};

// ---------------------------------------------------------------------------
// TRAIT POOLS
// ---------------------------------------------------------------------------

// --- GOOD TRAITS ---
const goodTraits = [
  makeTrait("Tough",          "Good", "Damage taken x0.5 (50% reduction)",   "Takes much less damage than normal.",                              {}, [], ["durability"]),
  makeTrait("Nimble",         "Good", "+15 melee dodge chance",               "Dodges melee attacks better than usual."),
  makeTrait("Quick sleeper",  "Good", "Sleep need reduced ~50%",              "Spends less time in bed and more time active."),
  makeTrait("Great memory",   "Good", "Skill decay rate reduced",             "Retains learned skills better over time."),
  makeTrait("Too smart",      "Good", "+75% Global Learning Factor, mood risk","Learns very fast, but is mentally less stable.",                  {}, [], ["learning", "nerves"]),
  makeTrait("Industrious",    "Good", "+35% Global Work Speed",               "Gets things done much faster than average.",                       {}, [], ["work"]),
  makeTrait("Hard worker",    "Good", "+20% Global Work Speed",               "A strong productivity boost.",                                     {}, [], ["work"]),
  makeTrait("Jogger",         "Good", "+0.4 cells/sec move speed",            "Moves around the map quickly.",                                    {}, [], ["speed"]),
  makeTrait("Fast walker",    "Good", "+0.2 cells/sec move speed",            "A smaller but useful movement boost.",                             {}, [], ["speed"]),
  makeTrait("Iron willed",    "Good", "−18% Mental Break Threshold",          "Less likely to break under pressure.",                             {}, [], ["nerves"]),
  makeTrait("Steadfast",      "Good", "−9% Mental Break Threshold",           "More stable than average.",                                        {}, [], ["nerves"]),
  makeTrait("Super immune",   "Good", "+30% Immunity Gain Speed",             "Builds immunity faster than average.",                             {}, [], ["health"]),
  makeTrait("Brawler",        "Good", "+4 melee hit chance, bad with ranged", "Good for melee-focused pawns, worse for ranged.",                  {}, [], ["ranged_style"]),
  makeTrait("Bloodlust",      "Good", "Mood bonus after combat",              "Violence-oriented trait; kept in Good because that is your category list.", {}, [], ["violence_style"]),
  makeTrait("Optimist",       "Good", "+6 permanent mood",                    "Keeps a higher mood baseline.",                                    {}, [], ["base_mood"])
];

// --- NEUTRAL TRAITS ---
const neutralTraits = [
  makeTrait("Careful shooter",         "Neutral", "Aiming Time +25%, Shooting Accuracy +5",          "Shoots more carefully, usually slower but more accurately.",      {}, [], ["ranged_style"]),
  makeTrait("Very neurotic",           "Neutral", "Global Work Speed +40%, Mental Break Threshold +14%","Very productive, but mentally fragile.",                         {}, [], ["neurotic", "nerves"]),
  makeTrait("Night owl",               "Neutral", "+16 mood at night, −10 in daytime",                "Works best on a night schedule."),
  makeTrait("Body modder",             "Neutral", "+8 mood with body mods, unhappy without them",     "Wants body modifications.",                                       {}, [], ["body_ideology"]),
  makeTrait("Neurotic",                "Neutral", "Global Work Speed +20%, Mental Break Threshold +8%","Balanced positive and negative effects.",                        {}, [], ["neurotic", "nerves"]),
  makeTrait("Body purist",             "Neutral", "Dislikes artificial body parts",                   "Prefers a natural body.",                                         {}, [], ["body_ideology"]),
  makeTrait("Kind",                    "Neutral", "Reduced insult chance",                            "Less likely to insult others.",                                   {}, [], ["social_style"]),
  makeTrait("Pretty",                  "Neutral", "+1 Pawn Beauty",                                   "Improves how others view the pawn.",                              {}, [], ["beauty"]),
  makeTrait("Beautiful",               "Neutral", "+2 Pawn Beauty",                                   "Greatly improves social opinion.",                                {}, [], ["beauty"]),
  makeTrait("Masochist",               "Neutral", "+10 mood when in pain",                            "Pain affects mood in unusual ways."),
  makeTrait("Undergrounder",           "Neutral", "No cabin fever, indoor bonuses",                   "Works fine in mountain or indoor colonies."),
  makeTrait("Ascetic",                 "Neutral", "Simple living mood benefits",                      "Needs less luxury than most pawns.",                              {}, [], ["luxury"]),
  makeTrait("Cannibal",                "Neutral", "Strong cannibal mood effects",                     "Strongly changes food and social behavior."),
  makeTrait("Tortured artist",         "Neutral", "Random inspiration on mental break",               "Unstable but can produce inspirations."),
  makeTrait("Creepy breathing",        "Neutral", "−15 social opinion",                               "Others find this pawn unsettling."),
  makeTrait("Annoying voice",          "Neutral", "−10 social opinion",                               "Others like them less."),
  makeTrait("Teetotaler",              "Neutral", "Never uses recreational drugs",                    "Avoids recreational drugs willingly.",                            {}, [], ["drug_interest"]),
  makeTrait("Trigger happy",           "Neutral", "Aiming Time −50%, Shooting Accuracy −5",           "Shoots faster but less accurately.",                              {}, [], ["ranged_style"]),
  makeTrait("Ugly",                    "Neutral", "−1 Pawn Beauty",                                   "Others tend to like them less.",                                  {}, [], ["beauty"]),
  makeTrait("Staggeringly ugly",       "Neutral", "−2 Pawn Beauty",                                   "Severely hurts social opinion.",                                  {}, [], ["beauty"]),
  makeTrait("Psychically hypersensitive","Neutral","+80% Psychic Sensitivity",                        "Very affected by psychic effects.",                               {}, [], ["psychic"]),
  makeTrait("Psychically sensitive",   "Neutral", "+40% Psychic Sensitivity",                         "More affected by psychic effects.",                               {}, [], ["psychic"]),
  makeTrait("Psychically dull",        "Neutral", "−50% Psychic Sensitivity",                         "Less affected by psychic effects.",
  makeTrait("Nudist",                  "Neutral", "+20 mood nude, −3 while clothed",        "Harder to manage with normal apparel and armor."),                               {}, [], ["psychic"]),
  makeTrait("Psychically deaf",        "Neutral", "−100% Psychic Sensitivity",                        "Mostly immune to psychic effects.",                               {}, [], ["psychic"]),
  makeTrait("Psychopath",              "Neutral", "No mood penalty from corpses",                     "Less affected by many social penalties.",                         {}, [], ["social_style"])
];

// --- BAD TRAITS ---
const badTraits = [
  makeTrait("Pessimist",           "Bad", "−6 permanent mood",                     "Lower mood baseline than average.",                             {}, [], ["base_mood"]),
  makeTrait("Pyromaniac",          "Bad", "Random fire-starting risk",              "May start fires and will not firefight normally."),
  makeTrait("Wimp",                "Bad", "Pain shock threshold −50%",              "Drops from pain very easily.",                                  {}, [], ["durability"]),
  makeTrait("Delicate",            "Bad", "Damage taken x1.5",                      "More fragile in combat.",                                       {}, [], ["durability"]),
  makeTrait("Slow learner",        "Bad", "−75% Global Learning Factor",            "Skills grow much more slowly.",                                 {}, [], ["learning"]),
  makeTrait("Chemical fascination","Bad", "Frequent drug binges",                   "High addiction and binge risk.",                                {}, [], ["drug_interest"]),
  makeTrait("Chemical interest",   "Bad", "Occasional drug binges",                 "May use recreational drugs more often.",                        {}, [], ["drug_interest"]),
  makeTrait("Lazy",                "Bad", "−20% Global Work Speed",                 "Gets jobs done more slowly.",                                   {}, [], ["work"]),
  makeTrait("Slothful",            "Bad", "−35% Global Work Speed",                 "Severe productivity penalty.",                                  {}, [], ["work"]),
  makeTrait("Slow poke",           "Bad", "−0.2 cells/sec move speed",              "Movement-heavy jobs suffer.",                                   {}, [], ["speed"]),
  makeTrait("Nervous",             "Bad", "+8% Mental Break Threshold",             "Breaks under stress more easily.",                              {}, [], ["nerves"]),
  makeTrait("Volatile",            "Bad", "+15% Mental Break Threshold",            "One of the worst stress traits.",                               {}, [], ["nerves"]),
  makeTrait("Sickly",              "Bad", "Gets sick more often",                   "More medical trouble over time.",                               {}, [], ["health"]),
  makeTrait("Gourmand",            "Bad", "Food binge mental breaks",               "Can create food management problems."),
  makeTrait("Greedy",              "Bad", "Needs impressive bedroom",               "Needs better rooms or status items.",                           {}, [], ["luxury"]),
  makeTrait("Jealous",             "Bad", "Needs best bedroom",                     "Can become unhappy if they do not get top status.",             {}, [], ["luxury"]),
  makeTrait("Abrasive",            "Bad", "Frequent social fights",                 "More likely to upset other pawns.",                             {}, [], ["social_style"])
];

export const TRAITS = {
  good:    goodTraits,
  neutral: neutralTraits,
  bad:     badTraits
};
