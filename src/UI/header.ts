import { elementCreators } from './element-creators';

const { createElement, createButton } = elementCreators;

export function createHeader(): HTMLElement {
  const header = createElement('header', {
    className: 'header',
    parent: document.body,
  });
  const nav = createElement('nav', {
    className: 'header__nav',
    parent: header,
  });

  createButton('New Game', 'button button--primary header__button', nav);
  createButton('Options', 'button header__button', nav);
  const topButton = createButton('Top ', 'button header__button', nav);
  createElement('span', {
    className: 'header__top-length',
    text: 10,
    parent: topButton,
  });

  return header;
}
