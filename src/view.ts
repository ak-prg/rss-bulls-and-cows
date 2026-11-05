import { createBoard } from './UI/game-board';
import { createHeader } from './UI/header';

export function renderInitial() {
  createHeader();
  createBoard();
}
