import {
  DEFAULT_LENGTH,
  DEFAULT_BASE,
  LENGTH_OPTIONS,
  BASE_OPTIONS,
  SAMPLE_COUNT,
} from '../constants';
import { countPossibleSecrets } from '../core/game-utils';
import type { SettingsCallbacks, State } from '../types';
import { elementCreators } from './element-creators';

const {
  createElement,
  createButton,
  createDialog,
  createFieldset,
  appendEach,
} = elementCreators;

let dialog: HTMLDialogElement;
let selectedRadix: number;
let selectedLength: number;
let combinations: number;
let callbacks: SettingsCallbacks;
let radioInputs: HTMLInputElement[] = [];
let radixButtons: HTMLButtonElement[] = [];
let countValue: HTMLSpanElement;

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
  const startButton = createButton(
    'New Game',
    'button settings-modal__start',
    actions
  );
  const cancelButton = createButton('Cancel', 'button', actions);

  radios.addEventListener('change', onLengthChoiceClick);
  choices.addEventListener('click', onBaseChoiceClick);
  startButton.addEventListener('click', onStartNewGame);
  cancelButton.addEventListener('click', hide);
  dialog.addEventListener('click', onBackdropClick);

  return dialog;
}

export function initSettingsModal(
  element: HTMLDialogElement,
  state: State,
  cb: SettingsCallbacks
): void {
  dialog = element;
  callbacks = cb;
  selectedRadix = state.radix;
  selectedLength = state.secretLength;
  combinations = countPossibleSecrets(selectedLength, selectedRadix);

  radioInputs = Array.from(
    dialog.querySelectorAll<HTMLInputElement>('.settings-modal__radio-input')
  );
  radixButtons = Array.from(
    dialog.querySelectorAll<HTMLButtonElement>('.settings-modal__choice')
  );
  countValue = dialog.querySelector(
    '.settings-modal__count-value'
  ) as HTMLSpanElement;

  renderSelection();
  dialog.showModal();
}

function renderSelection(): void {
  const isBinary = selectedRadix === 2;

  radioInputs.forEach((input) => {
    const length = Number(input.value);
    input.checked = length === selectedLength;
    input.disabled = isBinary;
    input.parentElement?.classList.toggle(
      'settings-modal__radio--disabled',
      isBinary && length !== selectedLength
    );
  });

  radixButtons.forEach((button) => {
    const isSelected = Number(button.value) === selectedRadix;
    button.classList.toggle('settings-modal__choice--selected', isSelected);
  });

  countValue.textContent = String(combinations);
}

function hide() {
  dialog.close();
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog) hide();
}

function onLengthChoiceClick(event: Event) {
  selectedLength = Number((event.target as HTMLInputElement).value);
  combinations = countPossibleSecrets(selectedLength, selectedRadix);
  renderSelection();
}

function onBaseChoiceClick(event: MouseEvent) {
  const val = Number((event.target as HTMLElement).closest('button')?.value);
  if (val) selectedRadix = val;
  if (val === 2) selectedLength = 2;
  combinations = countPossibleSecrets(selectedLength, selectedRadix);
  renderSelection();
}

function onStartNewGame() {
  callbacks.onSetGameStatus('idle');
  callbacks.onSetRadix(selectedRadix);
  callbacks.onSetLength(selectedLength);
  callbacks.onStart();
  hide();
}
