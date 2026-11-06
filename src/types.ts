export interface ElementOptions {
  className?: string | undefined;
  text?: string | number | undefined;
  attrs?: Record<string, string> | undefined;
  parent?: HTMLElement | undefined;
}

export interface DialogParts {
  dialog: HTMLDialogElement;
  content: HTMLDivElement;
}

export interface MoveResult {
  bulls: number;
  cows: number;
}

export interface Move extends MoveResult {
  guess: string;
}

export interface HeaderCallbacks {
  onNewGame: () => void;
  onOpenRecords: () => void;
}

export interface ViewCallbacks {
  onNewGame: () => void;
}
