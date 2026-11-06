import { state } from './model';
import type {
  BoardCallbacks,
  GameStatus,
  HeaderCallbacks,
  SettingsCallbacks,
  ViewCallbacks,
} from './types';
import {
  createViews,
  initGameBoard,
  openInitRecordsModal,
  openInitSettingsModal,
} from './view';

let viewCb: ViewCallbacks;
let boardCb: BoardCallbacks;
let headerCb: HeaderCallbacks;
let settingsCb: SettingsCallbacks;

export function main(): void {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onGuess(guess: string) {
  return;
}

// settings callbacs
function onSetRadix(radix: number): void {
  void radix;
}

function onSetLength(length: number): void {
  void length;
}

function onSetGameStatus(status: GameStatus): void {
  void status;
}

function onStart(): void {
  initGameBoard(state);
}

// function onChangeDetected() {
//   updateUI(state);
// }
