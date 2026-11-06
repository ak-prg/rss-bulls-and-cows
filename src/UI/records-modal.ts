import { SAMPLE_ROWS, TABLE_HEADERS, TOP_LENGTH } from '../constants';
import { elementCreators } from './element-creators';

const {
  createElement,
  createButton,
  createDialog,
  createTableRow,
  appendEach,
} = elementCreators;

export function createRecordsModal(): HTMLDialogElement {
  const { dialog, content } = createDialog(
    'records-modal',
    'Top ',
    document.body
  );

  const title = content.querySelector<HTMLHeadingElement>(
    '.records-modal__title'
  );
  if (title) {
    createElement('span', {
      className: 'records-modal__top-length',
      text: TOP_LENGTH,
      parent: title,
    });
  }

  createElement('p', {
    className: 'records-modal__settings',
    text: 'Length: 4 Base: 10',
    parent: content,
  });

  const table = createElement('table', {
    className: 'records-modal__table',
    parent: content,
  });

  const thead = createElement('thead', { parent: table });
  createTableRow(
    TABLE_HEADERS,
    'th',
    'records-modal__cell records-modal__cell--header',
    thead
  );

  const tbody = createElement('tbody', { parent: table });
  appendEach(tbody, SAMPLE_ROWS, (values) =>
    createTableRow(values, 'td', 'records-modal__cell')
  );

  createElement('p', {
    className: 'records-modal__empty',
    text: 'No results yet',
    parent: content,
  });

  createButton('Close', 'button button--primary records-modal__close', content);

  return dialog;
}
