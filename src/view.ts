import { createFooter } from './UI/footer';
import { createBoard } from './UI/game-board';
import { createHeader } from './UI/header';
import { createRecordsModal } from './UI/records-modal';
import { createSettingsModal } from './UI/settings-modal';

export function renderInitial() {
  createHeader();
  createBoard();
  createFooter();
  createSettingsModal();
  createRecordsModal();
}
