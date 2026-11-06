import { state } from './model';
import type { ViewCallbacks } from './types';
import { initUI, openSettingsModal, renderInitial } from './view';

export function main(): void {
  const viewCallbacks: ViewCallbacks = { onNewGame };

  renderInitial(viewCallbacks);
  initUI(state);
}

function onNewGame() {
  openSettingsModal();
  initUI(state);
}

// function onChangeDetected() {
//   updateUI(state);
// }
