import { describe, it, expect } from 'vitest';
import {
  areDigitsUnique,
  countPossibleSecrets,
  createDigitValidator,
  generateSecret,
  isGuessLengthOk,
  isGuessRepeated,
  isValidGuess,
  validateLengthSecret,
  validateRadixInput,
} from './game-utils';
import type { Move } from '../types';

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

describe('countPossibleSecrets', () => {
  const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

  it('returns 1 for length 0 (base case)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it.each([
    [1, 10, 10],
    [2, 2, 2],
    [3, 8, 336],
    [4, 10, 5040],
    [6, 16, 5765760],
  ])('length %i, base %i → %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it.each([
    [2, 8],
    [5, 10],
    [6, 10],
    [3, 16],
  ])(
    'matches base! / (base - length)! for length %i, base %i',
    (length, base) => {
      expect(countPossibleSecrets(length, base)).toBe(
        factorial(base) / factorial(base - length)
      );
    }
  );

  it('returns the same value on repeated calls', () => {
    const first = countPossibleSecrets(5, 16);
    const second = countPossibleSecrets(5, 16);
    expect(second).toBe(first);
  });
});

describe('isGuessLengthOk', () => {
  it.each([
    ['12', 2],
    ['1234', 4],
    ['f0e1d2', 6],
  ])('accepts input for correct length', (guess, length) => {
    expect(isGuessLengthOk(guess, length)).toBe(true);
  });

  it.each([
    ['123', 4],
    ['12345', 4],
    ['', 2],
  ])('rejects input for incorrect length', (guess, length) => {
    expect(isGuessLengthOk(guess, length)).toBe(false);
  });
});

describe('areDigitsUnique', () => {
  it.each(['0123', 'abcd', 'f0e1d2', '01'])(
    'accepts unique digits in the input',
    (guess) => {
      expect(areDigitsUnique(guess)).toBe(true);
    }
  );

  it.each(['1123', '00', 'abca'])(
    'rejects repeated digits in the input',
    (guess) => {
      expect(areDigitsUnique(guess)).toBe(false);
    }
  );

  it('treats upper and lower case as the same digit', () => {
    expect(areDigitsUnique('aA12')).toBe(false);
    expect(areDigitsUnique('Ab12')).toBe(true);
  });

  it('accepts an empty string', () => {
    expect(areDigitsUnique('')).toBe(true);
  });
});

describe('isGuessRepeated', () => {
  const moves: readonly Readonly<Move>[] = Object.freeze([
    Object.freeze({ guess: '123', bulls: 1, cows: 0 }),
    Object.freeze({ guess: 'abc', bulls: 0, cows: 1 }),
  ]);

  it('detects a guess already in history', () => {
    expect(isGuessRepeated('123', moves)).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isGuessRepeated('ABC', moves)).toBe(true);
  });

  it('returns false for a new guess', () => {
    expect(isGuessRepeated('321', moves)).toBe(false);
  });

  it('returns false for empty history', () => {
    expect(isGuessRepeated('123', [])).toBe(false);
  });

  // Mutating a frozen object throws an error, and not.toThrow() would catch it,
  // so any mutation makes the test fail.
  it('does not mutate history', () => {
    expect(() => isGuessRepeated('999', moves)).not.toThrow();
    expect(moves).toHaveLength(2);
  });
});

// Deterministic random sources
const always = (value: number) => () => value;
const sequence = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length] ?? 0;
};
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

describe('generateSecret', () => {
  it('returns a predictable result with a deterministic random', () => {
    expect(generateSecret(4, 10, always(0))).toBe('3210');
    expect(generateSecret(3, 10, always(0.999))).toBe('789');
  });

  it('returns the same result for the same random sequence', () => {
    const a = generateSecret(4, 16, sequence([0.1, 0.7, 0.3, 0.9]));
    const b = generateSecret(4, 16, sequence([0.1, 0.7, 0.3, 0.9]));
    expect(a).toBe(b);
  });

  it('can start with zero (leading zero kept in string)', () => {
    const secret = generateSecret(1, 10, always(0));
    expect(secret).toBe('0');
    expect(typeof secret).toBe('string');
  });

  it('uses only digits of the given base', () => {
    expect(generateSecret(2, 2, always(0.999))).toBe('01');
    expect(generateSecret(2, 16, always(0.999))).toBe('ef');
  });

  it.each([
    [2, 2],
    [4, 8],
    [6, 10],
    [6, 16],
  ])(
    'length %i, base %i: correct length, unique, valid digits',
    (length, base) => {
      const random = seeded(length * 100 + base);
      for (let n = 0; n < 50; n++) {
        const secret = generateSecret(length, base, random);
        expect(secret).toHaveLength(length);
        expect(new Set(secret).size).toBe(length);
        expect(isValidGuess(secret, length, base)).toBe(true);
      }
    }
  );

  it('uses Math.random by default', () => {
    const secret = generateSecret(4, 10);
    expect(isValidGuess(secret, 4, 10)).toBe(true);
  });
});

describe('isValidGuess', () => {
  it.each([
    ['0123', 4, 10],
    ['9876', 4, 10],
    ['01', 2, 2],
    ['1237', 4, 8],
    ['abcd', 4, 16],
    ['aBcD', 4, 16],
    ['f0e1d2', 6, 16],
  ])('accepts %s (length %i, base %i)', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(true);
  });

  it.each([
    ['123', 4, 10],
    ['12345', 4, 10],
    ['', 2, 10],
  ])('rejects wrong length: %s (length %i, base %i)', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });

  it.each([
    ['1123', 4, 10],
    ['00', 2, 2],
    ['aA12', 4, 16],
  ])('rejects repeated digits: %s', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });

  it.each([
    ['12a3', 4, 10],
    ['1238', 4, 8],
    ['02', 2, 2],
    ['ag', 2, 16],
    ['1 23', 4, 10],
  ])('rejects invalid digits: %s (base %i)', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });
});

describe('validateRadixInput', () => {
  it.each([2, 8, 10, 16])('accepts %i', (radix) => {
    expect(validateRadixInput(radix)).toBe(true);
  });

  it.each([0, 1, 3, 9, 12, 17, -10, 10.5])('rejects %s', (radix) => {
    expect(validateRadixInput(radix)).toBe(false);
  });
});

describe('validateLengthSecret', () => {
  it('allows only length 2 for binary', () => {
    expect(validateLengthSecret(2, 2)).toBe(true);
    expect(validateLengthSecret(3, 2)).toBe(false);
    expect(validateLengthSecret(6, 2)).toBe(false);
  });

  it.each([
    [2, 8],
    [6, 8],
    [2, 10],
    [6, 10],
    [2, 16],
    [6, 16],
  ])('accepts length %i for base %i', (length, base) => {
    expect(validateLengthSecret(length, base)).toBe(true);
  });

  it.each([
    [1, 10],
    [7, 10],
    [0, 16],
  ])('rejects out-of-range length %i for base %i', (length, base) => {
    expect(validateLengthSecret(length, base)).toBe(false);
  });

  it('rejects non-integer length', () => {
    expect(validateLengthSecret(2.5, 10)).toBe(false);
    expect(validateLengthSecret(NaN, 10)).toBe(false);
  });
});
