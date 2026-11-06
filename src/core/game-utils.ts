import { DIGITS } from '../constants';
import type { Move } from '../types';

export function createDigitValidator(base: number): (char: string) => boolean {
  const charset = DIGITS.slice(0, base);
  return (char: string): boolean => {
    return char.length === 1 && charset.includes(char.toLowerCase());
  };
}

export function isGuessLengthOk(guess: string, length: number): boolean {
  void guess;
  void length;
  throw new Error('not implemented');
}

export function areDigitsUnique(guess: string): boolean {
  void guess;
  throw new Error('not implemented');
}

export function isGuessRepeated(
  guess: string,
  moves: readonly Readonly<Move>[]
): boolean {
  void guess;
  void moves;
  throw new Error('not implemented');
}

export function createPermutationCounter(): (
  length: number,
  base: number
) => number {
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
