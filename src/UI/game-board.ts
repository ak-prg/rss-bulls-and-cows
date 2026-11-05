import { elementCreators } from './element-creators';

const { createElement } = elementCreators;

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
