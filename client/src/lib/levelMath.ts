/**
 * Client-side display helpers only.
 * Never treat these as authoritative — all XP/level data comes from the API.
 */

export function xpBarPercent(xp: number, nextLevelXp: number): number {
  if (nextLevelXp <= 0) return 100;
  return Math.min(100, Math.round((xp / nextLevelXp) * 100));
}

/**
 * Next project creation unlock level.
 * First unlock is Level 5; subsequent unlocks every 10 levels (15, 25, 35...)
 */
export function nextCreationUnlockLevel(currentLevel: number): number {
  if (currentLevel < 5) return 5;
  return Math.ceil((currentLevel - 5) / 10) * 10 + 5;
}

export function levelRomanNumeral(level: number): string {
  const numerals = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ] as [number, string][];
  let result = '';
  let n = level;
  for (const [val, sym] of numerals) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}
