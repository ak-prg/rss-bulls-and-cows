import { addStat } from './core/game-utils_';
import { persistData } from './storage';
import type { GameStatus, Round, RoundStat, State } from './types';

export let state: State = {} as State;

export function updateState(
  key: string,
  value: number | GameStatus | Readonly<Round>
): void {
  state = { ...state, [key]: value };
}

export function finishRound(): void {
  updateStats(createStatistics());
  persistStats();
}

export function updateStats(newStat: RoundStat): void {
  updateState('statistics', addStat(state.statistics, newStat));
}

function persistStats(): void {
  persistData(state.statistics);
}

function createStatistics(): RoundStat {
  const dateNow = Date.now();
  return {
    date: dateNow,
    radix: state.radix,
    secretLength: state.secretLength,
    moves: state.round.moves.length,
    timeMs: dateNow - state.round.startTime,
  };
}
