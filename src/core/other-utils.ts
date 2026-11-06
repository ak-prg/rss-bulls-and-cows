// Pure functions

import type { CategoryKey, RoundStat, StatsByCategory } from '../types';

export function getCategoryKey(
  secretLength: number,
  radix: number
): CategoryKey {
  return `${secretLength}:${radix}`;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function toRowValues(
  record: RoundStat,
  index: number,
  timezoneOffsetMin: number
): string[] {
  return [
    String(index + 1),
    formatDate(record.date, timezoneOffsetMin),
    String(record.moves),
    formatTime(record.timeMs),
  ];
}

export function formatDate(ms: number, timezoneOffsetMin: number): string {
  const local = new Date(ms - timezoneOffsetMin * 60000);
  const day = String(local.getUTCDate()).padStart(2, '0');
  const month = String(local.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${local.getUTCFullYear()}`;
}

// todo

export function getTop10(stats: readonly RoundStat[]): RoundStat[] {
  void stats;
  throw new Error('not implemented');
}

export function addStat(
  stats: StatsByCategory,
  newStat: RoundStat
): StatsByCategory {
  void stats;
  void newStat;
  throw new Error('not implemented');
}
