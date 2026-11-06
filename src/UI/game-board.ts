import { DIGITS } from '../constants';
import type { BoardCallbacks, Move, State } from '../types';
import { elementCreators } from './element-creators';
import { createHistoryRow } from './history-row';
import { createInputRow, initInputRow, updateInputRow } from './input-row';

const { createElement } = elementCreators;

let historyList: HTMLUListElement;
let first: HTMLLIElement;
let last: HTMLDivElement;
let charset: string;
let allowed: HTMLSpanElement;
let winMessageSpan: HTMLSpanElement;

export function createBoard(): HTMLElement {
  const board = createElement('main', {
    className: 'game-board',
    parent: document.body,
  });
  createElement('ul', { className: 'game-board__history', parent: board });

  const symbols = createElement('p', {
    className: 'game-board__symbols',
    text: 'Allowed symbols:',
    parent: board,
  });
  createElement('span', {
    className: 'game-board__symbols-list',
    text: '0123456789',
    parent: symbols,
  });

  createElement('span', {
    className: 'game-board__win-message text-success',
    text: 'Well done!',
    parent: board,
  });

  return board;
}

export function initBoard(state: State, callbacks: BoardCallbacks): void {
  const firstRow: Move = {
    guess: '?'.repeat(state.secretLength),
    bulls: 0,
    cows: 0,
  };

  historyList = document.querySelector(
    '.game-board__history'
  ) as HTMLUListElement;
  first = createHistoryRow(firstRow, true, historyList);
  last = createInputRow(historyList);
  initInputRow(last, state, callbacks.onGuess);

  charset = DIGITS.slice(0, state.radix);
  allowed = document.querySelector(
    '.game-board__symbols-list'
  ) as HTMLSpanElement;

  winMessageSpan = document.querySelector(
    '.game-board__win-message'
  ) as HTMLSpanElement;

  updateBoard(state);
}

export function updateBoard(state: State): void {
  historyList.replaceChildren();
  historyList.appendChild(first);
  const middle = state.round.moves.map((move) =>
    createHistoryRow(move, false, historyList)
  );
  middle.forEach((el) => historyList.appendChild(el));
  historyList.appendChild(last);

  updateInputRow(state);

  const isPlaying = state.gameStatus === 'playing';
  allowed.textContent = charset;

  (allowed.parentElement as HTMLElement).hidden = !isPlaying;
  last.hidden = !isPlaying;
  winMessageSpan.hidden = state.gameStatus !== 'won';
}
