// Simple profanity filter — no external dependency needed.
// Uses a compact list. Extend as needed for your campus.

const PROFANITY_LIST = [
  'ass','asshole','bastard','bitch','bullshit','crap','cunt','damn','dick',
  'fuck','fucking','hell','idiot','jerk','motherfucker','piss','pussy',
  'shit','slut','whore',
];

const pattern = new RegExp(
  `\\b(${PROFANITY_LIST.join('|')})\\b`,
  'gi'
);

/**
 * Returns true if the text contains profanity.
 */
export function containsProfanity(text) {
  if (!text) return false;
  return pattern.test(text);
}

/**
 * Returns a cleaned version of the text with profanity replaced by asterisks.
 */
export function cleanText(text) {
  if (!text) return '';
  return text.replace(pattern, (match) => '*'.repeat(match.length));
}
