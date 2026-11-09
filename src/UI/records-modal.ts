import { SAMPLE_ROWS, TABLE_HEADERS, TOP_LENGTH } from '../constants';
import { getCategoryKey, toRowValues } from '../core/other-utils';
import type { State } from '../types';
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

  const closeButton = content.querySelector<HTMLButtonElement>(
    '.records-modal__close'
  );
  closeButton?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

export function initRecordsModal(
  dialog: HTMLDialogElement,
  state: State
): void {
  const settings = dialog.querySelector<HTMLParagraphElement>(
    '.records-modal__settings'
  );
  const table = dialog.querySelector<HTMLTableElement>('.records-modal__table');
  const tbody = dialog.querySelector<HTMLTableSectionElement>('tbody');
  const empty = dialog.querySelector<HTMLParagraphElement>(
    '.records-modal__empty'
  );
  if (!settings || !table || !tbody || !empty) return;

  const key = getCategoryKey(state.secretLength, state.radix);
  const records = (state.statistics[key] ?? []).slice(0, TOP_LENGTH);

  settings.textContent = `Length: ${state.secretLength} Base: ${state.radix}`;
  tbody.replaceChildren(
    ...records.map((record, index) =>
      createTableRow(
        toRowValues(record, index, new Date(record.date).getTimezoneOffset()),
        'td',
        'records-modal__cell'
      )
    )
  );

  table.hidden = records.length === 0;
  empty.hidden = records.length > 0;

  dialog.showModal();
}
