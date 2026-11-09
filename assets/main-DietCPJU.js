// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// src/constants.ts
var AUTHORS_REPO = "https://github.com/ak-prg";
var RSS_COURSE = "https://rs.school/courses/javascript";
var LENGTH_OPTIONS = [
	2,
	3,
	4,
	5,
	6
];
var BASE_OPTIONS = [
	{
		name: "bin",
		radix: 2
	},
	{
		name: "oct",
		radix: 8
	},
	{
		name: "dec",
		radix: 10
	},
	{
		name: "hex",
		radix: 16
	}
];
var SAMPLE_COUNT = 5040;
var TABLE_HEADERS = [
	"#",
	"Date",
	"Attempts",
	"Time"
];
var SAMPLE_ROWS = [[
	"1",
	"05.11.2026",
	"3",
	"01:05"
], [
	"2",
	"05.11.2026",
	"5",
	"00:30"
]];
var DIGITS = "0123456789abcdef";
var LOC_STOR_KEY = "rss-bulls-cows";
var EMPTY_ROUND = {
	secret: "0123",
	moves: [],
	startTime: 0
};
// src/core/game-utils.ts
function isGuessLengthOk(guess, length) {
	return guess.length === length;
}
function areDigitsUnique(guess) {
	return new Set(guess.toLowerCase()).size === guess.length;
}
function createDigitValidator(base) {
	const charset = DIGITS.slice(0, base);
	return (char) => {
		return char.length === 1 && charset.includes(char.toLowerCase());
	};
}
function isGuessRepeated(guess, moves) {
	return moves.some((item) => item.guess.toLowerCase() === guess.toLowerCase());
}
function createPermutationCounter() {
	let cache = /* @__PURE__ */ new Map();
	return function count(length, base) {
		const key = `${length}-${base}`;
		const cached = cache.get(key);
		if (cached !== void 0) return cached;
		const result = length === 0 ? 1 : base * count(length - 1, base - 1);
		cache = new Map([...cache, [key, result]]);
		return result;
	};
}
var countPossibleSecrets = createPermutationCounter();
function validateRadixInput(input) {
	return [
		2,
		8,
		10,
		16
	].includes(input);
}
function validateLengthSecret(length, base) {
	if (!Number.isInteger(length)) return false;
	if (base === 2) return length === 2;
	return length >= 2 && length <= 6;
}
function makeChoice(length, digits, random) {
	const currentChoice = digits[Math.floor(digits.length * random())] ?? "";
	if (length === 1) return currentChoice;
	const withoutCurrent = digits.filter((d) => d !== currentChoice);
	return makeChoice(length - 1, withoutCurrent, random) + currentChoice;
}
function generateSecret(length, base, random = Math.random) {
	return makeChoice(length, DIGITS.split("").slice(0, base), random);
}
function isValidGuess(guess, length, base) {
	return isGuessLengthOk(guess, length) && areDigitsUnique(guess) && areDigitsAllowed(guess, base);
}
function areDigitsAllowed(guess, base) {
	const validator = createDigitValidator(base);
	return [...guess].every((char) => {
		return validator(char);
	});
}
function evaluateGuess(secret, guess) {
	const secretMap = getSecretMapFromCache(secret);
	return [...secret].reduce((acc, _, i) => {
		const result = secretMap.get((guess[i] ?? "").toLowerCase());
		if (result === i) return {
			...acc,
			bulls: acc.bulls + 1
		};
		else if (result !== void 0) return {
			...acc,
			cows: acc.cows + 1
		};
		else return acc;
	}, {
		bulls: 0,
		cows: 0
	});
}
function createCacheGetter() {
	let secretCache = /* @__PURE__ */ new Map();
	return function getter(secret) {
		const cached = secretCache.get(secret);
		if (cached) return cached;
		const newMap = new Map([...secret].map((k, i) => [k, i]));
		secretCache = new Map([...secretCache, [secret, newMap]]);
		return newMap;
	};
}
var getSecretMapFromCache = createCacheGetter();
// src/core/other-utils.ts
function getCategoryKey(secretLength, radix) {
	return `${secretLength}:${radix}`;
}
function formatTime(ms) {
	const totalSeconds = Math.floor(ms / 1e3);
	return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
function toRowValues(record, index, timezoneOffsetMin) {
	return [
		String(index + 1),
		formatDate(record.date, timezoneOffsetMin),
		String(record.moves),
		formatTime(record.timeMs)
	];
}
function formatDate(ms, timezoneOffsetMin) {
	const local = /* @__PURE__ */ new Date(ms - timezoneOffsetMin * 6e4);
	return `${String(local.getUTCDate()).padStart(2, "0")}.${String(local.getUTCMonth() + 1).padStart(2, "0")}.${local.getUTCFullYear()}`;
}
function getTop10(stats) {
	return [...stats].sort((a, b) => a.moves - b.moves || a.timeMs - b.timeMs).slice(0, 10);
}
function addStat(stats, newStat) {
	const key = getCategoryKey(newStat.secretLength, newStat.radix);
	const updatedList = getTop10([...stats[key] ?? [], newStat]);
	return {
		...stats,
		[key]: updatedList
	};
}
// src/storage.ts
function fetchData() {
	try {
		return JSON.parse(localStorage.getItem("rss-bulls-cows") ?? "{}") ?? {};
	} catch {
		return {};
	}
}
function persistData(data) {
	localStorage.setItem(LOC_STOR_KEY, JSON.stringify(data));
}
// src/model.ts
var state = {};
var onChange;
function initState(stateCb) {
	onChange = stateCb.onChangeDetected;
	state = {
		round: EMPTY_ROUND,
		statistics: fetchData(),
		gameStatus: "idle",
		radix: 10,
		secretLength: 4
	};
}
function updateState(changes) {
	state = {
		...state,
		...changes
	};
	onChange();
}
function finishRound() {
	updateStats(createStatistics());
	persistStats();
}
function updateStats(newStat) {
	updateState({ statistics: addStat(state.statistics, newStat) });
}
function persistStats() {
	persistData(state.statistics);
}
function createStatistics() {
	const dateNow = Date.now();
	return {
		date: dateNow,
		radix: state.radix,
		secretLength: state.secretLength,
		moves: state.round.moves.length,
		timeMs: dateNow - state.round.startTime
	};
}
// src/UI/element-creators.ts
function createElement$7(tag, options = {}) {
	const { className, text, attrs, parent } = options;
	const el = document.createElement(tag);
	if (className) el.className = className;
	if (text !== void 0) el.textContent = String(text);
	if (attrs) Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
	if (parent) parent.append(el);
	return el;
}
function createButton$4(text, className, parent) {
	return createElement$7("button", {
		className,
		text,
		attrs: { type: "button" },
		parent
	});
}
function appendEach$3(parent, items, create) {
	const elements = items.map(create);
	parent.append(...elements);
}
function createLink$1(href, className, parent, text) {
	return createElement$7("a", {
		className,
		text,
		attrs: {
			href,
			target: "_blank",
			rel: "noopener noreferrer"
		},
		parent
	});
}
function createDialog$2(block, title, parent) {
	const dialog = createElement$7("dialog", {
		className: block,
		parent
	});
	const content = createElement$7("div", {
		className: `${block}__content`,
		parent: dialog
	});
	createElement$7("h2", {
		className: `${block}__title`,
		text: title,
		parent: content
	});
	return {
		dialog,
		content
	};
}
function createFieldset$1(block, legend, parent) {
	const fieldset = createElement$7("fieldset", {
		className: `${block}__section`,
		parent
	});
	createElement$7("legend", {
		className: `${block}__section-title`,
		text: legend,
		parent: fieldset
	});
	return fieldset;
}
function createTableRow$1(values, cellTag, cellClass, parent) {
	const row = createElement$7("tr", { parent });
	values.forEach((value) => createElement$7(cellTag, {
		className: cellClass,
		text: value,
		parent: row
	}));
	return row;
}
var elementCreators = {
	createElement: createElement$7,
	createButton: createButton$4,
	appendEach: appendEach$3,
	createLink: createLink$1,
	createDialog: createDialog$2,
	createFieldset: createFieldset$1,
	createTableRow: createTableRow$1
};
// src/UI/footer.ts
var { createElement: createElement$6, createLink } = elementCreators;
function createFooter() {
	const footer = createElement$6("footer", {
		className: "footer",
		parent: document.body
	});
	createLink(AUTHORS_REPO, "footer__link", footer, "GitHub");
	createElement$6("span", {
		text: 2026,
		parent: footer
	});
	createElement$6("img", {
		className: "footer__logo",
		attrs: {
			src: "rss-logo-new.svg",
			alt: "RS School"
		},
		parent: createLink(RSS_COURSE, "footer__link", footer)
	});
	return footer;
}
// src/UI/history-row.ts
var { createElement: createElement$5, appendEach: appendEach$2 } = elementCreators;
function createHistoryRow(move, secret, parent) {
	const rowClass = secret ? "history-row history-row--secret" : "history-row";
	const cellClass = secret ? "history-row__cell history-row__cell--secret" : "history-row__cell";
	const resultClass = secret ? "history-row__result history-row__result--labels" : "history-row__result";
	const row = createElement$5("li", {
		className: rowClass,
		parent
	});
	appendEach$2(createElement$5("div", {
		className: "history-row__cells",
		parent: row
	}), [...move.guess], (char) => createElement$5("span", {
		className: cellClass,
		text: char
	}));
	const result = createElement$5("div", {
		className: resultClass,
		parent: row
	});
	createElement$5("span", {
		className: "history-row__bulls",
		text: secret ? "Bulls" : move.bulls,
		parent: result
	});
	createElement$5("span", {
		className: "history-row__cows",
		text: secret ? "Cows" : move.cows,
		parent: result
	});
	return row;
}
// src/UI/input-row.ts
var { createElement: createElement$4, createButton: createButton$3 } = elementCreators;
var inputs = [];
var validateChar;
var guess = "";
var currentState;
var message;
var onGuess$1;
function createInputRow(parent) {
	const row = createElement$4("div", {
		className: "input-row",
		parent
	});
	createElement$4("div", {
		className: "input-row__cells",
		parent: row
	});
	createButton$3("Try", "button button--primary input-row__go", createElement$4("div", {
		className: "input-row__action",
		parent: row
	}));
	createElement$4("span", {
		className: "input-row__message",
		attrs: { "aria-live": "polite" },
		parent: row
	});
	return row;
}
function initInputRow(row, state, guessCallback) {
	onGuess$1 = guessCallback;
	const cells = row.querySelector(".input-row__cells");
	const tryButton = row.querySelector(".input-row__go");
	message = row.querySelector(".input-row__message");
	if (!cells || !tryButton) return;
	inputs = Array.from({ length: state.secretLength }, (_, i) => i).map((index) => createElement$4("input", {
		className: "input-row__input",
		attrs: {
			type: "text",
			maxlength: "1",
			autocomplete: "off",
			"aria-label": `Digit ${index + 1}`
		}
	}));
	cells.replaceChildren(...inputs);
	validateChar = createDigitValidator(state.radix);
	cells.addEventListener("beforeinput", onBeforeInput);
	cells.addEventListener("input", saveInput);
	tryButton.addEventListener("click", onUserGuess);
}
function updateInputRow(state) {
	currentState = state;
	clearInput();
	message.textContent = "";
}
function clearInput() {
	inputs.forEach((input) => input.value = "");
	guess = "";
}
function onBeforeInput(event) {
	if (event.data && !validateChar(event.data)) event.preventDefault();
}
function saveInput() {
	guess = inputs.map((input) => input.value).join("");
	message.textContent = "";
}
function onUserGuess() {
	if (validateUserGuess(guess)) onGuess$1(guess);
}
function validateUserGuess(value) {
	if (!isGuessLengthOk(value, currentState.secretLength)) {
		message.textContent = "Incomplete input";
		return false;
	}
	if (!areDigitsUnique(value)) {
		message.textContent = "Contains duplicates";
		return false;
	}
	if (isGuessRepeated(value, currentState.round.moves)) {
		message.textContent = "Already tried";
		return false;
	}
	return true;
}
// src/UI/game-board.ts
var { createElement: createElement$3 } = elementCreators;
var historyList;
var first;
var last;
var charset;
var allowed;
var winMessageSpan;
function createBoard() {
	const board = createElement$3("main", {
		className: "game-board",
		parent: document.body
	});
	createElement$3("ul", {
		className: "game-board__history",
		parent: board
	});
	createElement$3("span", {
		className: "game-board__symbols-list",
		text: "0123456789",
		parent: createElement$3("p", {
			className: "game-board__symbols",
			text: "Allowed symbols:",
			parent: board
		})
	});
	createElement$3("span", {
		className: "game-board__win-message text-success",
		text: "Well done!",
		parent: board
	});
	return board;
}
function initBoard(state, callbacks) {
	const firstRow = {
		guess: "?".repeat(state.secretLength),
		bulls: 0,
		cows: 0
	};
	historyList = document.querySelector(".game-board__history");
	first = createHistoryRow(firstRow, true, historyList);
	last = createInputRow(historyList);
	initInputRow(last, state, callbacks.onGuess);
	charset = DIGITS.slice(0, state.radix);
	allowed = document.querySelector(".game-board__symbols-list");
	winMessageSpan = document.querySelector(".game-board__win-message");
	updateBoard(state);
}
function updateBoard(state) {
	historyList.replaceChildren();
	historyList.appendChild(first);
	state.round.moves.forEach((move) => createHistoryRow(move, false, historyList));
	historyList.appendChild(last);
	updateInputRow(state);
	const isPlaying = state.gameStatus === "playing";
	allowed.textContent = charset;
	allowed.parentElement.hidden = !isPlaying;
	last.hidden = !isPlaying;
	winMessageSpan.hidden = state.gameStatus !== "won";
}
// src/UI/header.ts
var { createElement: createElement$2, createButton: createButton$2 } = elementCreators;
function createHeader(callbacks) {
	const header = createElement$2("header", {
		className: "header",
		parent: document.body
	});
	const nav = createElement$2("nav", {
		className: "header__nav",
		parent: header
	});
	const newGameButton = createButton$2("New Game", "button button--primary header__button", nav);
	const topButton = createButton$2("Top ", "button header__button", nav);
	createElement$2("span", {
		className: "header__top-length",
		text: 10,
		parent: topButton
	});
	newGameButton.addEventListener("click", callbacks.onNewGame);
	topButton.addEventListener("click", callbacks.onOpenRecords);
	return header;
}
// src/UI/records-modal.ts
var { createElement: createElement$1, createButton: createButton$1, createDialog: createDialog$1, createTableRow, appendEach: appendEach$1 } = elementCreators;
function createRecordsModal() {
	const { dialog, content } = createDialog$1("records-modal", "Top ", document.body);
	const title = content.querySelector(".records-modal__title");
	if (title) createElement$1("span", {
		className: "records-modal__top-length",
		text: 10,
		parent: title
	});
	createElement$1("p", {
		className: "records-modal__settings",
		text: "Length: 4 Base: 10",
		parent: content
	});
	const table = createElement$1("table", {
		className: "records-modal__table",
		parent: content
	});
	createTableRow(TABLE_HEADERS, "th", "records-modal__cell records-modal__cell--header", createElement$1("thead", { parent: table }));
	appendEach$1(createElement$1("tbody", { parent: table }), SAMPLE_ROWS, (values) => createTableRow(values, "td", "records-modal__cell"));
	createElement$1("p", {
		className: "records-modal__empty",
		text: "No results yet",
		parent: content
	});
	createButton$1("Close", "button button--primary records-modal__close", content);
	content.querySelector(".records-modal__close")?.addEventListener("click", () => dialog.close());
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close();
	});
	return dialog;
}
function initRecordsModal(dialog, state) {
	const settings = dialog.querySelector(".records-modal__settings");
	const table = dialog.querySelector(".records-modal__table");
	const tbody = dialog.querySelector("tbody");
	const empty = dialog.querySelector(".records-modal__empty");
	if (!settings || !table || !tbody || !empty) return;
	const key = getCategoryKey(state.secretLength, state.radix);
	const records = (state.statistics[key] ?? []).slice(0, 10);
	settings.textContent = `Length: ${state.secretLength} Base: ${state.radix}`;
	tbody.replaceChildren(...records.map((record, index) => createTableRow(toRowValues(record, index, new Date(record.date).getTimezoneOffset()), "td", "records-modal__cell")));
	table.hidden = records.length === 0;
	empty.hidden = records.length > 0;
	dialog.showModal();
}
// src/UI/settings-modal.ts
var { createElement, createButton, createDialog, createFieldset, appendEach } = elementCreators;
var dialog;
var selectedRadix;
var selectedLength;
var combinations;
var callbacks;
var radioInputs = [];
var radixButtons = [];
var countValue;
function createLengthOption(length) {
	const label = createElement("label", { className: "settings-modal__radio" });
	const input = createElement("input", {
		className: "settings-modal__radio-input",
		attrs: {
			type: "radio",
			name: "length",
			value: String(length)
		},
		parent: label
	});
	input.checked = length === 4;
	label.append(String(length));
	return label;
}
function createRadixOption(option) {
	const className = option.radix === 10 ? "settings-modal__choice settings-modal__choice--selected" : "settings-modal__choice";
	const button = createButton(`${option.name} (${option.radix})`, className);
	button.value = String(option.radix);
	return button;
}
function createSettingsModal() {
	const { dialog, content } = createDialog("settings-modal", "Options", document.body);
	const radios = createElement("div", {
		className: "settings-modal__radios",
		parent: createFieldset("settings-modal", "Secret number length", content)
	});
	appendEach(radios, LENGTH_OPTIONS, createLengthOption);
	const choices = createElement("div", {
		className: "settings-modal__choices",
		parent: createFieldset("settings-modal", "Number base", content)
	});
	appendEach(choices, BASE_OPTIONS, createRadixOption);
	createElement("span", {
		className: "settings-modal__count-value",
		text: SAMPLE_COUNT,
		parent: createElement("p", {
			className: "settings-modal__count",
			text: "Possible secrets: ",
			parent: content
		})
	});
	const actions = createElement("div", {
		className: "settings-modal__actions",
		parent: content
	});
	const startButton = createButton("New Game", "button settings-modal__start", actions);
	const cancelButton = createButton("Cancel", "button", actions);
	radios.addEventListener("change", onLengthChoiceClick);
	choices.addEventListener("click", onBaseChoiceClick);
	startButton.addEventListener("click", onStartNewGame);
	cancelButton.addEventListener("click", hide);
	dialog.addEventListener("click", onBackdropClick);
	return dialog;
}
function initSettingsModal(element, state, cb) {
	dialog = element;
	callbacks = cb;
	selectedRadix = state.radix;
	selectedLength = state.secretLength;
	combinations = countPossibleSecrets(selectedLength, selectedRadix);
	radioInputs = Array.from(dialog.querySelectorAll(".settings-modal__radio-input"));
	radixButtons = Array.from(dialog.querySelectorAll(".settings-modal__choice"));
	countValue = dialog.querySelector(".settings-modal__count-value");
	renderSelection();
	dialog.showModal();
}
function renderSelection() {
	const isBinary = selectedRadix === 2;
	radioInputs.forEach((input) => {
		const length = Number(input.value);
		input.checked = length === selectedLength;
		input.disabled = isBinary;
		input.parentElement?.classList.toggle("settings-modal__radio--disabled", isBinary && length !== selectedLength);
	});
	radixButtons.forEach((button) => {
		const isSelected = Number(button.value) === selectedRadix;
		button.classList.toggle("settings-modal__choice--selected", isSelected);
	});
	countValue.textContent = String(combinations);
}
function hide() {
	dialog.close();
}
function onBackdropClick(event) {
	if (event.target === dialog) hide();
}
function onLengthChoiceClick(event) {
	selectedLength = Number(event.target.value);
	combinations = countPossibleSecrets(selectedLength, selectedRadix);
	renderSelection();
}
function onBaseChoiceClick(event) {
	const val = Number(event.target.closest("button")?.value);
	if (val) selectedRadix = val;
	if (val === 2) selectedLength = 2;
	combinations = countPossibleSecrets(selectedLength, selectedRadix);
	renderSelection();
}
function onStartNewGame() {
	callbacks.onSetGameStatus("idle");
	callbacks.onSetRadix(selectedRadix);
	callbacks.onSetLength(selectedLength);
	callbacks.onStart();
	hide();
}
// src/view.ts
var settingsModal;
var recordsModal;
var viewCb$1;
function createViews(callbacks) {
	viewCb$1 = callbacks;
	createHeader(viewCb$1.headerCb);
	createBoard();
	createFooter();
	settingsModal = createSettingsModal();
	recordsModal = createRecordsModal();
}
function openInitRecordsModal(state) {
	initRecordsModal(recordsModal, state);
}
function openInitSettingsModal(state) {
	initSettingsModal(settingsModal, state, viewCb$1.settingsCb);
}
function initGameBoard(state) {
	initBoard(state, viewCb$1.boardCb);
}
function updateGameBoard(state) {
	updateBoard(state);
}
// src/controller.ts
var stateCb;
var viewCb;
var boardCb;
var headerCb;
var settingsCb;
function main() {
	stateCb = { onChangeDetected };
	headerCb = {
		onNewGame,
		onOpenRecords
	};
	boardCb = { onGuess };
	settingsCb = {
		onSetRadix,
		onSetLength,
		onStart,
		onSetGameStatus
	};
	viewCb = {
		headerCb,
		boardCb,
		settingsCb
	};
	initState(stateCb);
	createViews(viewCb);
	initGameBoard(state);
}
function onNewGame() {
	openInitSettingsModal(state);
}
function onOpenRecords() {
	openInitRecordsModal(state);
}
function onGuess(answer) {
	if (state.gameStatus !== "playing") return;
	const guess = answer.trim();
	if (!isValidGuess(guess, state.secretLength, state.radix)) return;
	if (isGuessRepeated(guess, state.round.moves)) return;
	const move = {
		...evaluateGuess(state.round.secret, guess),
		guess
	};
	updateState({ round: {
		...state.round,
		moves: [...state.round.moves, move]
	} });
	if (move.bulls === state.secretLength) {
		finishRound();
		onSetGameStatus("won");
	}
}
function onSetRadix(choice) {
	if (state.gameStatus === "playing") return;
	if (!validateRadixInput(choice)) return;
	updateState({ radix: choice });
}
function onSetLength(choice) {
	if (state.gameStatus === "playing") return;
	if (!validateLengthSecret(choice, state.radix)) return;
	updateState({ secretLength: choice });
}
function onSetGameStatus(status) {
	updateState({ gameStatus: status });
}
function onStart() {
	if (state.gameStatus === "playing") return;
	if (!validateLengthSecret(state.secretLength, state.radix)) return;
	onSetGameStatus("playing");
	updateState({ round: {
		secret: generateSecret(state.secretLength, state.radix),
		startTime: Date.now(),
		moves: []
	} });
	initGameBoard(state);
}
function onChangeDetected() {
	updateGameBoard(state);
}
// src/index.ts
main();

//# sourceMappingURL=main-DietCPJU.js.map