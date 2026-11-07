import { DEFAULT_BASE, DEFAULT_LENGTH, EMPTY_ROUND } from './constants';
import { addStat } from './core/other-utils';
import { fetchData, persistData } from './storage';
import type { RoundStat, State, StateCallbacks } from './types';

export let state: State = {} as State;
let onChange: () => void;

export function initState(stateCb: StateCallbacks): void {
  onChange = stateCb.onChangeDetected;
  state = {
    round: EMPTY_ROUND,
    statistics: fetchData(),
    gameStatus: 'idle',
    radix: DEFAULT_BASE,
    secretLength: DEFAULT_LENGTH,
  };
}

export function updateState(changes: Partial<State>): void {
  state = { ...state, ...changes };
  onChange();
}

export function finishRound(): void {
  updateStats(createStatistics());
  persistStats();
}

export function updateStats(newStat: RoundStat): void {
  updateState({ statistics: addStat(state.statistics, newStat) });
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
