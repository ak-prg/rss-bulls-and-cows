import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './game-utils';

/*
it.each syntax for multiple cases with same expected result:
First parens: the list of cases. Each case becomes the arguments of the callback.
Second parens: the usual it arguments, a name and a callback.
 */

describe('createDigitValidator returned validator', () => {
  it('returns a predicate function', () => {
    expect(typeof createDigitValidator(10)).toBe('function');
  });

  it.each([
    [2, '01', '29a'],
    [8, '01234567', '89a'],
    [10, '0123456789', 'af'],
    [16, '0123456789abcdefABCDEF', 'gGz'],
  ])(
    'base accepts correct input and rejects incorrect',
    (base, valid, invalid) => {
      const isDigit = createDigitValidator(base);
      [...valid].forEach((char) => expect(isDigit(char)).toBe(true));
      [...invalid].forEach((char) => expect(isDigit(char)).toBe(false));
    }
  );

  it('rejects empty string and multi-character input', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('')).toBe(false);
    expect(isDigit('ab')).toBe(false);
  });

  it('works as a callback for array methods', () => {
    const isOctal = createDigitValidator(8);
    expect([...'0127'].every(isOctal)).toBe(true);
    expect([...'0128'].filter(isOctal)).toEqual(['0', '1', '2']);
  });
});
