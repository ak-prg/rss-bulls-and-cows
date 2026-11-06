import type { ViewCallbacks } from './types';
import { openSettingsModal, renderInitial } from './view';

export function main(): void {
  const viewCallbacks: ViewCallbacks = { onNewGame };

  renderInitial(viewCallbacks);
}

function onNewGame() {
  openSettingsModal();
}
