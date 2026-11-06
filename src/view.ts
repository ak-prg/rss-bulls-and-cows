import type { HeaderCallbacks, ViewCallbacks } from './types';
import { createFooter } from './UI/footer';
import { createBoard } from './UI/game-board';
import { createHeader } from './UI/header';
import { createRecordsModal } from './UI/records-modal';
import { createSettingsModal } from './UI/settings-modal';

// let board: HTMLElement;
let settingsModal: HTMLDialogElement;
let recordsModal: HTMLDialogElement;

export function renderInitial(callbacks: ViewCallbacks) {
  const headerCB: HeaderCallbacks = {
    onNewGame: callbacks.onNewGame,
    onOpenRecords: openRecordsModal,
  };

  createHeader(headerCB);
  createBoard();
  createFooter();
  settingsModal = createSettingsModal() as HTMLDialogElement;
  recordsModal = createRecordsModal() as HTMLDialogElement;
}

const openRecordsModal = () => {
  recordsModal.showModal();
};

export function openSettingsModal() {
  settingsModal.showModal();
}
