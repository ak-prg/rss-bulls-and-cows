import type { CategoryKey, RoundStat } from '../types';

export function getCategoryKey(
  secretLength: number,
  radix: number
): CategoryKey {
  void secretLength;
  void radix;
  return '' as CategoryKey;
}

export function formatTime(ms: number): string {
  void ms;
  return '';
}

export function toRowValues(
  record: RoundStat,
  index: number,
  timezoneOffsetMin: number
): string[] {
  void record;
  void index;
  void timezoneOffsetMin;
  return [''];
}

export function formatDate(ms: number, timezoneOffsetMin: number): string {
  void ms;
  void timezoneOffsetMin;
  return '';
}
