import type { State, ViewCallbacks } from './types';
import { createFooter } from './UI/footer';
import { createBoard, initBoard, updateBoard } from './UI/game-board';
import { createHeader } from './UI/header';
import { createRecordsModal, initRecordsModal } from './UI/records-modal';
import { createSettingsModal, initSettingsModal } from './UI/settings-modal';

let settingsModal: HTMLDialogElement;
let recordsModal: HTMLDialogElement;
let viewCb: ViewCallbacks;

export function createViews(callbacks: ViewCallbacks) {
  viewCb = callbacks;
  createHeader(viewCb.headerCb);
  createBoard();
  createFooter();
  settingsModal = createSettingsModal() as HTMLDialogElement;
  recordsModal = createRecordsModal() as HTMLDialogElement;
}

export function openInitRecordsModal(state: State) {
  initRecordsModal(recordsModal, state);
}

export function openInitSettingsModal(state: State) {
  initSettingsModal(settingsModal, state, viewCb.settingsCb);
}

export function initGameBoard(state: State) {
  initBoard(state, viewCb.boardCb);
}

export function updateGameBoard(state: State) {
  updateBoard(state);
}
