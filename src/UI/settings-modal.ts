import {
  DEFAULT_LENGTH,
  DEFAULT_BASE,
  LENGTH_OPTIONS,
  BASE_OPTIONS,
  SAMPLE_COUNT,
} from '../constants';
import { elementCreators } from './element-creators';

const {
  createElement,
  createButton,
  createDialog,
  createFieldset,
  appendEach,
} = elementCreators;

function createLengthOption(length: number): HTMLLabelElement {
  const label = createElement('label', { className: 'settings-modal__radio' });
  const input = createElement('input', {
    className: 'settings-modal__radio-input',
    attrs: { type: 'radio', name: 'length', value: String(length) },
    parent: label,
  });

  input.checked = length === DEFAULT_LENGTH;
  label.append(String(length));

  return label;
}

function createRadixOption(option: {
  name: string;
  radix: number;
}): HTMLButtonElement {
  const isSelected = option.radix === DEFAULT_BASE;
  const className = isSelected
    ? 'settings-modal__choice settings-modal__choice--selected'
    : 'settings-modal__choice';

  const button = createButton(`${option.name} (${option.radix})`, className);
  button.value = String(option.radix);

  return button;
}

export function createSettingsModal(): HTMLDialogElement {
  const { dialog, content } = createDialog(
    'settings-modal',
    'Options',
    document.body
  );

  const lengthSection = createFieldset(
    'settings-modal',
    'Secret number length',
    content
  );
  const radios = createElement('div', {
    className: 'settings-modal__radios',
    parent: lengthSection,
  });
  appendEach(radios, LENGTH_OPTIONS, createLengthOption);

  const radixSection = createFieldset('settings-modal', 'Number base', content);
  const choices = createElement('div', {
    className: 'settings-modal__choices',
    parent: radixSection,
  });
  appendEach(choices, BASE_OPTIONS, createRadixOption);

  const count = createElement('p', {
    className: 'settings-modal__count',
    text: 'Possible secrets: ',
    parent: content,
  });
  createElement('span', {
    className: 'settings-modal__count-value',
    text: SAMPLE_COUNT,
    parent: count,
  });

  const actions = createElement('div', {
    className: 'settings-modal__actions',
    parent: content,
  });
  createButton('New Game', 'button settings-modal__start', actions);
  createButton('Cancel', 'button', actions);

  return dialog;
}
