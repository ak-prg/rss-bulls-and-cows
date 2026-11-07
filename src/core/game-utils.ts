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

// to add
export function validateRadixInput(input: number): boolean {
  void input;
  throw new Error('not implemented');
}

export function validateLengthSecret(length: number, base: number): boolean {
  void length;
  void base;
  throw new Error('not implemented');
}

function makeChoice(
  length: number,
  digits: string[],
  random: () => number
): string {
  const randomIndex = Math.floor(digits.length * random());
  const currentChoice = digits[randomIndex] ?? '';

  if (length === 1) return currentChoice;

  const withoutCurrent = digits.filter((d) => d !== currentChoice);
  return makeChoice(length - 1, withoutCurrent, random) + currentChoice;
}

export function generateSecret(
  length: number,
  base: number,
  random = Math.random
): string {
  const digits = DIGITS.split('').slice(0, base);
  return makeChoice(length, digits, random);
}

export function isValidGuess(
  guess: string,
  length: number,
  base: number
): boolean {
  void length;
  void base;
  void guess;
  throw new Error('not implemented');
}
