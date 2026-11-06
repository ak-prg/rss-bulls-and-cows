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

export interface BoardCallbacks {
  onGuess: (guess: string) => void;
}

export interface State {
  round: Readonly<Round>;
  statistics: StatsByCategory;
  gameStatus: GameStatus;
  radix: number;
  secretLength: number;
}

export interface Round {
  radix: number;
  secretLength: number;
  secret: string;
  moves: readonly Readonly<Move>[];
  startTime: number;
}

export type StatsByCategory = Record<CategoryKey, RoundStat[]>;

export type CategoryKey = `${number}:${number}`;

export interface RoundStat {
  date: number;
  radix: number;
  secretLength: number;
  moves: number;
  timeMs: number;
}

export type GameStatus = 'idle' | 'playing' | 'won';
