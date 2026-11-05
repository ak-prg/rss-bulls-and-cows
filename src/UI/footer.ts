import { AUTHORS_REPO, RSS_COURSE } from '../constants';
import { elementCreators } from './element-creators';

const { createElement, createLink } = elementCreators;

export function createFooter(): HTMLElement {
  const footer = createElement('footer', {
    className: 'footer',
    parent: document.body,
  });

  createLink(AUTHORS_REPO, 'footer__link', footer, 'GitHub');
  createElement('span', { text: 2026, parent: footer });

  const schoolLink = createLink(RSS_COURSE, 'footer__link', footer);
  createElement('img', {
    className: 'footer__logo',
    attrs: { src: 'rss-logo-new.svg', alt: 'RS School' },
    parent: schoolLink,
  });

  return footer;
}
