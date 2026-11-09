import { describe, it, expect } from 'vitest';
import {
  addStat,
  formatDate,
  formatTime,
  getCategoryKey,
  getTop10,
  toRowValues,
} from './other-utils';
import type { RoundStat, StatsByCategory } from '../types';

describe('getCategoryKey', () => {
  it('returns concatinated arguments with colon', () => {
    expect(getCategoryKey(2, 2)).toEqual('2:2');
  });

  it('keeps argument order', () => {
    expect(getCategoryKey(4, 10)).toBe('4:10');
  });

  it('handles multi-digit numbers', () => {
    expect(getCategoryKey(12, 36)).toBe('12:36');
  });
});

describe('formatTime', () => {
  it('returns concatinated 1 min and 1 sec for 61 000 ms', () => {
    expect(formatTime(61000)).toBe('01:01');
  });

  it('formats zero', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds only', () => {
    expect(formatTime(5000)).toBe('00:05');
  });

  it('formats exact minutes', () => {
    expect(formatTime(120000)).toBe('02:00');
  });

  it('formats two-digit minutes and seconds', () => {
    expect(formatTime(754000)).toBe('12:34');
  });

  it('drops leftover milliseconds', () => {
    expect(formatTime(1999)).toBe('00:01');
  });
});

describe('formatDate', () => {
  const YEAR = 2026;
  const JANUARY = 0;
  const NOVEMBER = 10;
  const DECEMBER = 11;

  const NOON = 12;
  const EARLY_MORNING = 1;
  const LATE_EVENING = 22;

  const UTC_OFFSET = 0;
  const UTC_PLUS_3_OFFSET = -180;
  const UTC_MINUS_3_OFFSET = 180;

  it('formats date in UTC', () => {
    expect(formatDate(Date.UTC(YEAR, NOVEMBER, 6, NOON), UTC_OFFSET)).toBe(
      '06.11.2026'
    );
  });

  it('pads day and month with zero', () => {
    expect(formatDate(Date.UTC(YEAR, JANUARY, 5, NOON), UTC_OFFSET)).toBe(
      '05.01.2026'
    );
  });

  it('keeps two-digit day and month', () => {
    expect(formatDate(Date.UTC(YEAR, DECEMBER, 25, NOON), UTC_OFFSET)).toBe(
      '25.12.2026'
    );
  });

  it('moves to next day for timezone ahead of UTC', () => {
    expect(
      formatDate(Date.UTC(YEAR, NOVEMBER, 6, LATE_EVENING), UTC_PLUS_3_OFFSET)
    ).toBe('07.11.2026');
  });

  it('moves to previous day for timezone behind UTC', () => {
    expect(
      formatDate(Date.UTC(YEAR, NOVEMBER, 6, EARLY_MORNING), UTC_MINUS_3_OFFSET)
    ).toBe('05.11.2026');
  });

  it('crosses year boundary', () => {
    expect(
      formatDate(Date.UTC(YEAR, JANUARY, 1, EARLY_MORNING), UTC_MINUS_3_OFFSET)
    ).toBe('31.12.2025');
  });
});

describe('toRowValues', () => {
  const UTC_OFFSET = 0;
  const UTC_MINUS_3_OFFSET = 180;

  const record: RoundStat = {
    date: Date.UTC(2026, 10, 6, 12),
    moves: 7,
    timeMs: 61000,
    radix: 10,
    secretLength: 4,
  };

  it('returns row values in correct order', () => {
    expect(toRowValues(record, 0, UTC_OFFSET)).toEqual([
      '1',
      '06.11.2026',
      '7',
      '01:01',
    ]);
  });

  it('converts zero-based index to one-based row number', () => {
    expect(toRowValues(record, 9, UTC_OFFSET)[0]).toBe('10');
  });

  it('applies timezone offset to date', () => {
    const earlyRecord: RoundStat = {
      ...record,
      date: Date.UTC(2026, 10, 6, 1),
    };
    expect(toRowValues(earlyRecord, 0, UTC_MINUS_3_OFFSET)[1]).toBe(
      '05.11.2026'
    );
  });
});

const stat = (moves: number, timeMs: number): RoundStat => ({
  date: 0,
  radix: 10,
  secretLength: 4,
  moves,
  timeMs,
});

describe('getTop10', () => {
  it('returns an empty array for no stats', () => {
    expect(getTop10([])).toEqual([]);
  });

  it('sorts by moves ascending', () => {
    const result = getTop10([stat(9, 100), stat(3, 100), stat(5, 100)]);
    expect(result.map((s) => s.moves)).toEqual([3, 5, 9]);
  });

  it('breaks ties by time ascending', () => {
    const result = getTop10([stat(5, 3000), stat(5, 1000), stat(5, 2000)]);
    expect(result.map((s) => s.timeMs)).toEqual([1000, 2000, 3000]);
  });

  it.each([
    [
      [stat(6, 1000), stat(5, 9000)],
      [5, 6],
    ],
    [
      [stat(5, 9000), stat(6, 1000)],
      [5, 6],
    ],
    [
      [stat(5, 9000), stat(6, 1000), stat(4, 5000)],
      [4, 5, 6],
    ],
    [
      [stat(7, 1000), stat(5, 9000), stat(6, 500)],
      [5, 6, 7],
    ],
  ])('prefers fewer moves over shorter time (case %#)', (input, expected) => {
    expect(getTop10(input).map((s) => s.moves)).toEqual(expected);
  });

  it('keeps only the best 10', () => {
    const stats = Array.from({ length: 15 }, (_, i) => stat(15 - i, 1000));
    const result = getTop10(stats);
    expect(result).toHaveLength(10);
    expect(result.map((s) => s.moves)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns all when fewer than 10', () => {
    expect(getTop10([stat(1, 1), stat(2, 2)])).toHaveLength(2);
  });

  it('does not mutate the input array', () => {
    const input = Object.freeze([stat(9, 1), stat(1, 1)]);
    const result = getTop10(input);
    expect(input.map((s) => s.moves)).toEqual([9, 1]);
    expect(result).not.toBe(input);
  });
});

describe('addStat', () => {
  const statFor = (
    moves: number,
    secretLength: number,
    radix: number
  ): RoundStat => ({
    date: 0,
    radix,
    secretLength,
    moves,
    timeMs: 1000,
  });

  it('creates the category when it does not exist yet', () => {
    const result = addStat({}, statFor(3, 4, 10));
    expect(result['4:10']).toEqual([statFor(3, 4, 10)]);
  });

  it('adds to an existing category in sorted order', () => {
    const stats: StatsByCategory = {
      '4:10': [statFor(2, 4, 10), statFor(5, 4, 10)],
    };
    const result = addStat(stats, statFor(3, 4, 10));
    expect(result['4:10']?.map((s) => s.moves)).toEqual([2, 3, 5]);
  });

  it('keeps only the best 10 in the category', () => {
    const stats: StatsByCategory = {
      '4:10': Array.from({ length: 10 }, (_, i) => statFor(i + 1, 4, 10)),
    };
    const result = addStat(stats, statFor(11, 4, 10));
    expect(result['4:10']).toHaveLength(10);
    expect(result['4:10']?.map((s) => s.moves)).not.toContain(11);
  });

  it('leaves other categories unchanged', () => {
    const other = [statFor(1, 2, 2)];
    const result = addStat({ '2:2': other }, statFor(3, 4, 10));
    expect(result['2:2']).toBe(other);
  });

  it('does not mutate the input', () => {
    const list = [statFor(5, 4, 10)];
    const stats: StatsByCategory = { '4:10': list };
    Object.freeze(list);
    Object.freeze(stats);

    const result = addStat(stats, statFor(3, 4, 10));
    expect(stats['4:10']).toHaveLength(1);
    expect(result).not.toBe(stats);
  });
});
