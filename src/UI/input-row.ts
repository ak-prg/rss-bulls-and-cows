import {
  createDigitValidator,
  isGuessLengthOk,
  areDigitsUnique,
  isGuessRepeated,
} from '../core/game-utils';
import type { State } from '../types';
import { elementCreators } from './element-creators';

const { createElement, createButton } = elementCreators;

let inputs: HTMLInputElement[] = [];
let validateChar: (char: string) => boolean;
let guess = '';
let currentState: State;
let message: HTMLSpanElement;
let onGuess: (guess: string) => void;

export function createInputRow(parent: HTMLElement): HTMLDivElement {
  const row = createElement('div', { className: 'input-row', parent });

  createElement('div', {
    className: 'input-row__cells',
    parent: row,
  });

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

export function initInputRow(
  row: HTMLDivElement,
  state: State,
  guessCallback: (guess: string) => void
): void {
  onGuess = guessCallback;
  const cells = row.querySelector<HTMLDivElement>('.input-row__cells');
  const tryButton = row.querySelector<HTMLButtonElement>('.input-row__go');
  message = row.querySelector<HTMLSpanElement>(
    '.input-row__message'
  ) as HTMLSpanElement;

  if (!cells || !tryButton) return;

  const indexes = Array.from({ length: state.secretLength }, (_, i) => i);
  inputs = indexes.map((index) =>
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
  cells.replaceChildren(...inputs);

  validateChar = createDigitValidator(state.radix);

  cells.addEventListener('beforeinput', onBeforeInput);
  cells.addEventListener('input', saveInput);
  tryButton.addEventListener('click', onUserGuess);
}

export function updateInputRow(state: State): void {
  currentState = state;
  clearInput();
  message.textContent = '';
}

function clearInput(): void {
  inputs.forEach((input) => (input.value = ''));
  guess = '';
}

function onBeforeInput(event: InputEvent): void {
  if (event.data && !validateChar(event.data)) event.preventDefault();
}

function saveInput(): void {
  guess = inputs.map((input) => input.value).join('');
  message.textContent = '';
}

function onUserGuess(): void {
  if (validateUserGuess(guess)) onGuess(guess);
}

function validateUserGuess(value: string): boolean {
  if (!isGuessLengthOk(value, currentState.secretLength)) {
    message.textContent = 'Incomplete input';
    return false;
  }

  if (!areDigitsUnique(value)) {
    message.textContent = 'Contains duplicates';
    return false;
  }

  if (isGuessRepeated(value, currentState.round.moves)) {
    message.textContent = 'Already tried';
    return false;
  }

  return true;
}
