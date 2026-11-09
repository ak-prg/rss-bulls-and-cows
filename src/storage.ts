import { LOC_STOR_KEY } from './constants';
import type { StatsByCategory } from './types';

export function fetchData(): StatsByCategory {
  try {
    return JSON.parse(localStorage.getItem(LOC_STOR_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function persistData(data: StatsByCategory): void {
  localStorage.setItem(LOC_STOR_KEY, JSON.stringify(data));
}
