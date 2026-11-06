import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  getCategoryKey,
  toRowValues,
} from './other-utils';
import type { RoundStat } from '../types';

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
