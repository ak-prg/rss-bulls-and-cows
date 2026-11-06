import type { DialogParts, ElementOptions } from '../types';

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

function createDialog(
  block: string,
  title: string,
  parent?: HTMLElement
): DialogParts {
  const dialog = createElement('dialog', { className: block, parent });
  const content = createElement('div', {
    className: `${block}__content`,
    parent: dialog,
  });
  createElement('h2', {
    className: `${block}__title`,
    text: title,
    parent: content,
  });

  return { dialog, content };
}

function createFieldset(
  block: string,
  legend: string,
  parent?: HTMLElement
): HTMLFieldSetElement {
  const fieldset = createElement('fieldset', {
    className: `${block}__section`,
    parent,
  });
  createElement('legend', {
    className: `${block}__section-title`,
    text: legend,
    parent: fieldset,
  });

  return fieldset;
}

export const elementCreators = {
  createElement,
  createButton,
  appendEach,
  createLink,
  createDialog,
  createFieldset,
};
