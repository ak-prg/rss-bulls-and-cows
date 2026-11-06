import { state } from './model';
import type { BoardCallbacks, ViewCallbacks } from './types';
import { initUI, openSettingsModal, renderInitial } from './view';

let viewCb: ViewCallbacks;
let boardCb: BoardCallbacks;

export function main(): void {
  viewCb = { onNewGame };
  boardCb = { onGuess };

  renderInitial(viewCb);
  initUI(state, boardCb);
}

function onNewGame() {
  openSettingsModal();
  initUI(state, boardCb);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onGuess(guess: string) {
  return;
}

// function onChangeDetected() {
//   updateUI(state);
// }
