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
  return () => {
    throw new Error('not implemented');
  };
}

export const countPossibleSecrets = createPermutationCounter();
