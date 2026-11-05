import type { ElementOptions } from '../types';

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {}
): HTMLElementTagNameMap[K] {
  const { className, text, attrs, parent } = options;
  const el = document.createElement(tag);

  if (className) el.className = className;
  if (text !== undefined) el.textContent = String(text);

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) =>
      el.setAttribute(name, value)
    );
  }

  if (parent) parent.append(el);
  return el;
}

function createButton(
  text: string,
  className: string,
  parent?: HTMLElement
): HTMLButtonElement {
  return createElement('button', {
    className,
    text,
    attrs: { type: 'button' },
    parent,
  });
}

function appendEach<T>(
  parent: HTMLElement,
  items: readonly T[],
  create: (item: T, index: number) => HTMLElement
): void {
  const elements = items.map(create);
  parent.append(...elements);
}

function createLink(
  href: string,
  className: string,
  parent?: HTMLElement,
  text?: string
): HTMLAnchorElement {
  const attrs = { href, target: '_blank', rel: 'noopener noreferrer' };
  return createElement('a', { className, text, attrs, parent });
}

export const elementCreators = {
  createElement,
  createButton,
  appendEach,
  createLink,
};
