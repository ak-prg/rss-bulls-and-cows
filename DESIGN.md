# Design

## Architecture

The app follows the MVC pattern. The state is stored in the Model.
The Model and the View don't know about each other.
The Controller connects them, and the game logic is part of the Controller.

## Data Structures

All objects are replaced, never mutated (spread is used for every update).
Each structure matches one lifecycle, and they nest inside each other:
`State` holds the `Round`, and the `Round` holds the `Move`s.

### App lifecycle: `State`

Created once at startup and lives until the page closes.
It holds the settings, `gameStatus` and `statistics`.

### Statistics: `Record<"length:radix", RoundStat[]>`

Lives longer than the app, because it's saved to localStorage.
It's a plain object rather than a `Map` because it goes straight through `JSON.stringify`.
Lookup by key is O(1).

### Round lifecycle: `Round { secret, startTime, moves }`

Created on each new game and stored as `state.round`, replacing the previous round.
When the round is won, it's turned into one `RoundStat` and added to `statistics`.

- `secret` is a string so leading zeros are kept.
- `moves` is an array because the history of attempts is ordered.

### Move lifecycle: `Move { guess, bulls, cows }`

Created on each attempt and added to the current round with `[...round.moves, move]`.
It lives as long as its round does.

## Algorithms

### `evaluateGuess`: O(n)

It builds a cached `Map` of each secret digit to its position.
Then a single `reduce` goes through the guess:

- if a digit is in the map at the same position, it's a bull;
- if it's in the map at another position, it's a cow.

### `countPossibleSecrets`: O(n²), then O(1)

It counts permutations without repetition recursively:

```
count(length, base) = base × count(length − 1, base − 1)
count(0, base) = 1   // base case
```

Results are memoized in a `Map`, so calling it again with the same settings is O(1).

## Complexity: Big O

### `generateSecret`: O(n²)

- The recursion makes up to n calls, one per digit picked.
- Each call runs `filter` over up to n digits, which is O(n).
- n calls × O(n) each = **O(n²)**.

That's fine because it runs once per round and n is at most 16 (hex),
so the worst case is about 16 × 16 = 256 simple operations.

### `evaluateGuess`: O(n)

- `[...secret]` is O(n), done once.
- `reduce` makes n steps at O(1) each: a Map lookup, a lowercase on one character, and a comparison.
- `{ ...acc }` copies an object that always has exactly 2 keys, so it's O(1).

Together with `getSecretMapFromCache` it is O(n) + O(n) or O(n) + O(1); both give **O(n)**.

### `getSecretMapFromCache`: O(1) / O(n + r)

Helper function, runs once on each `evaluateGuess` call.

- **Cache hit:** O(1).
- **Cache miss:** O(n) to build the map, plus O(r) to copy the cache (r = rounds played) = **O(n + r)**, linear. This happens once per round.

### `isValidGuess`: O(n²)

- `isGuessLengthOk`: O(1), it just compares lengths.
- `areDigitsUnique`: O(n) to build the Set.
- `areDigitsAllowed`: `every` checks n characters, and each check's `includes` scans up to n digits of the charset, so O(n²).

O(1) + O(n) + O(n²) = **O(n²)**.

The charset has at most 16 characters, so it is fine.

### `countPossibleSecrets`: O(n²) / O(1)

- **Repeated call:** O(1), one Map lookup.
- **First call:** O(n²).
  - Recursion: n calls, so O(n).
  - Recreating the cache: each call copies the whole cache, so O(n²).

Using `cache.set()` instead of the copy would bring the first call down to O(n),
but with n ≤ 6 it makes no practical difference.

## Clean Code Principles

| Principle                        | Description                                                                   | Example                                       |
| -------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- |
| Meaningful names                 | Names show intent, like `isGuessRepeated` and `getSecretMapFromCache`.        | `game-utils.ts`, `isGuessRepeated`            |
| Small functions                  | Each function does one thing.                                                 | `game-utils.ts`, `isGuessLengthOk`            |
| Single Responsibility (SRP)      | Each module has one reason to change, as in the MVC split.                    | `storage.ts`, `persistData`                   |
| DRY (Don't Repeat Yourself)      | No duplicated logic, like the shared `createDigitValidator`.                  | `game-utils.ts`, `createDigitValidator`       |
| KISS (Keep It Simple)            | Choose the simplest solution that works.                                      | `other-utils.ts`, `getCategoryKey`            |
| YAGNI (You Aren't Gonna Need It) | Don't build features before they're needed.                                   | `other-utils.ts`, `formatTime`                |
| Few function arguments           | Ideally 0–2, at most 3.                                                       | `game-utils.ts`, `evaluateGuess`              |
| No side effects                  | Functions don't change hidden state, as with pure functions.                  | `other-utils.ts`, `addStat`                   |
| Immutability                     | Data is replaced, not mutated.                                                | `controller.ts`, `onGuess`                    |
| No magic numbers                 | Use named constants like `TOP_LENGTH` and `DIGITS`.                           | `other-utils.ts`, `getTop10`                  |
| Comments explain why, not what   | The code should explain itself.                                               | `game-utils.test.ts`, `isGuessRepeated` tests |
| Consistent formatting            | One code style throughout, enforced by Prettier or ESLint.                    | `element-creators.ts`, `createElement`        |
| Error handling                   | Fail safely, like the `try/catch` in `fetchData`.                             | `storage.ts`, `fetchData`                     |
| Separation of concerns           | Logic, state and UI are kept apart.                                           | `view.ts`, `createViews`                      |
| Testability                      | Pure functions with injected dependencies, like `random` in `generateSecret`. | `game-utils.ts`, `generateSecret`             |
