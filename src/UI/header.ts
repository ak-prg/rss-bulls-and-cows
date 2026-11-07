import { TOP_LENGTH } from '../constants';
import type { HeaderCallbacks } from '../types';
import { elementCreators } from './element-creators';

const { createElement, createButton } = elementCreators;

export function createHeader(callbacks: HeaderCallbacks): HTMLElement {
  const header = createElement('header', {
    className: 'header',
    parent: document.body,
  });
  const nav = createElement('nav', {
    className: 'header__nav',
    parent: header,
  });

  const newGameButton = createButton(
    'New Game',
    'button button--primary header__button',
    nav
  );
  const topButton = createButton('Top ', 'button header__button', nav);
  createElement('span', {
    className: 'header__top-length',
    text: TOP_LENGTH,
    parent: topButton,
  });

  newGameButton.addEventListener('click', callbacks.onNewGame);
  topButton.addEventListener('click', callbacks.onOpenRecords);

  return header;
}
