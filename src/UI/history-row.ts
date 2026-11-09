import type { Move } from '../types';
import { elementCreators } from './element-creators';

const { createElement, appendEach } = elementCreators;

export function createHistoryRow(
  move: Readonly<Move>,
  secret: boolean,
  parent: HTMLElement
): HTMLLIElement {
  const rowClass = secret ? 'history-row history-row--secret' : 'history-row';
  const cellClass = secret
    ? 'history-row__cell history-row__cell--secret'
    : 'history-row__cell';
  const resultClass = secret
    ? 'history-row__result history-row__result--labels'
    : 'history-row__result';

  const row = createElement('li', { className: rowClass, parent });

  const cells = createElement('div', {
    className: 'history-row__cells',
    parent: row,
  });
  appendEach(cells, [...move.guess], (char) =>
    createElement('span', { className: cellClass, text: char })
  );

  const result = createElement('div', { className: resultClass, parent: row });
  createElement('span', {
    className: 'history-row__bulls',
    text: secret ? 'Bulls' : move.bulls,
    parent: result,
  });
  createElement('span', {
    className: 'history-row__cows',
    text: secret ? 'Cows' : move.cows,
    parent: result,
  });

  return row;
}
