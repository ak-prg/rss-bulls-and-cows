import { elementCreators } from './element-creators';

const { createElement, createButton, appendEach } = elementCreators;

export function createInputRow(
  secretLength: number,
  parent: HTMLElement
): HTMLDivElement {
  const row = createElement('div', { className: 'input-row', parent });

  const cells = createElement('div', {
    className: 'input-row__cells',
    parent: row,
  });
  const indexes = Array.from({ length: secretLength }, (_, i) => i);
  appendEach(cells, indexes, (index) =>
    createElement('input', {
      className: 'input-row__input',
      attrs: {
        type: 'text',
        maxlength: '1',
        autocomplete: 'off',
        'aria-label': `Digit ${index + 1}`,
      },
    })
  );

  const action = createElement('div', {
    className: 'input-row__action',
    parent: row,
  });
  createButton('Try', 'button button--primary input-row__go', action);

  createElement('span', {
    className: 'input-row__message',
    attrs: { 'aria-live': 'polite' },
    parent: row,
  });

  return row;
}
