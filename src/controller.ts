import {
  validateRadixInput,
  validateLengthSecret,
  generateSecret,
  isValidGuess,
  isGuessRepeated,
  evaluateGuess,
} from './core/game-utils';
import { finishRound, initState, state, updateState } from './model';
import type {
  BoardCallbacks,
  GameStatus,
  HeaderCallbacks,
  SettingsCallbacks,
  StateCallbacks,
  ViewCallbacks,
} from './types';
import {
  createViews,
  initGameBoard,
  openInitRecordsModal,
  openInitSettingsModal,
  updateGameBoard,
} from './view';

let stateCb: StateCallbacks;
let viewCb: ViewCallbacks;
let boardCb: BoardCallbacks;
let headerCb: HeaderCallbacks;
let settingsCb: SettingsCallbacks;

export function main(): void {
  stateCb = {
    onChangeDetected,
  };

  headerCb = {
    onNewGame,
    onOpenRecords,
  };

  boardCb = { onGuess };

  settingsCb = {
    onSetRadix,
    onSetLength,
    onStart,
    onSetGameStatus,
  };

  viewCb = { headerCb, boardCb, settingsCb };

  initState(stateCb);
  createViews(viewCb);
  initGameBoard(state);
}

// header callbacks
function onNewGame() {
  openInitSettingsModal(state);
}

function onOpenRecords() {
  openInitRecordsModal(state);
}

// board callback

function onGuess(answer: string) {
  if (state.gameStatus !== 'playing') return;

  const guess = answer.trim();

  if (!isValidGuess(guess, state.secretLength, state.radix)) return;
  if (isGuessRepeated(guess, state.round.moves)) return;

  const result = evaluateGuess(state.round.secret, guess);
  const move = { ...result, guess };
  updateState({
    round: { ...state.round, moves: [...state.round.moves, move] },
  });
  if (move.bulls === state.secretLength) {
    finishRound();
    onSetGameStatus('won');
  }
}

// settings callbacs
function onSetRadix(choice: number): void {
  if (state.gameStatus === 'playing') return;
  if (!validateRadixInput(choice)) return;
  updateState({ radix: choice });
}

function onSetLength(choice: number): void {
  if (state.gameStatus === 'playing') return;
  if (!validateLengthSecret(choice, state.radix)) return;
  updateState({ secretLength: choice });
}

function onSetGameStatus(status: GameStatus): void {
  updateState({ gameStatus: status });
}

function onStart(): void {
  if (state.gameStatus === 'playing') return;
  if (!validateLengthSecret(state.secretLength, state.radix)) return;

  onSetGameStatus('playing');
  const newSecret = generateSecret(state.secretLength, state.radix);
  updateState({
    round: {
      secret: newSecret,
      startTime: Date.now(),
      moves: [],
    },
  });
  initGameBoard(state);
}

// undate some elements UI on every state change
function onChangeDetected() {
  updateGameBoard(state);
}
