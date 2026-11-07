import { DIGITS } from '../constants';
import type { Move, MoveResult } from '../types';

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

export function validateRadixInput(input: number): boolean {
  return [2, 8, 10, 16].includes(input);
}

export function validateLengthSecret(length: number, base: number): boolean {
  if (!Number.isInteger(length)) return false;
  if (base === 2) return length === 2;
  return length >= 2 && length <= 6;
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
  return (
    isGuessLengthOk(guess, length) &&
    areDigitsUnique(guess) &&
    areDigitsAllowed(guess, base)
  );
}

export function areDigitsAllowed(guess: string, base: number): boolean {
  const validator = createDigitValidator(base);
  return [...guess].every((char) => {
    return validator(char);
  });
}

export function evaluateGuess(secret: string, guess: string): MoveResult {
  const secretMap = getSecretMapFromCache(secret);

  return [...secret].reduce(
    (acc, _, i) => {
      const result = secretMap.get((guess[i] ?? '').toLowerCase());
      if (result === i) return { ...acc, bulls: acc.bulls + 1 };
      else if (result !== undefined) return { ...acc, cows: acc.cows + 1 };
      else return acc;
    },
    { bulls: 0, cows: 0 }
  );
}

function createCacheGetter(): (secret: string) => ReadonlyMap<string, number> {
  return () => {
    throw new Error('not implemented');
  };
}

export const getSecretMapFromCache = createCacheGetter();
