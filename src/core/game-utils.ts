import { DIGITS } from '../constants';
import type { Move } from '../types';

export function isGuessLengthOk(guess: string, length: number): boolean {
  return guess.length === length;
}

export function areDigitsUnique(guess: string): boolean {
  const set = new Set(guess.toLowerCase());
  return set.size === guess.length;
}

export function createDigitValidator(base: number): (char: string) => boolean {
  const charset = DIGITS.slice(0, base);
  return (char: string): boolean => {
    return char.length === 1 && charset.includes(char.toLowerCase());
  };
}

export function isGuessRepeated(
  guess: string,
  moves: readonly Readonly<Move>[]
): boolean {
  return moves.some((item) => item.guess.toLowerCase() === guess.toLowerCase());
}

export function createPermutationCounter() {
  let cache = new Map<string, number>();

  return function count(length: number, base: number): number {
    const key = `${length}-${base}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const result = length === 0 ? 1 : base * count(length - 1, base - 1);
    cache = new Map<string, number>([...cache, [key, result]]);
    return result;
  };
}

export const countPossibleSecrets = createPermutationCounter();
