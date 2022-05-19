const assert = require('assert');
const { wordleSolver, wordle } = require('../src/wordleSolver.js');
const { words } = require('../src/words.js');

describe('wordleSolver', () => {
  it('should give the actual back', () => {
    assert.deepStrictEqual(wordleSolver('crane', 'audio', words), 'crane');
  });
});

describe('wordle', () => {
  it('should give regular expression', () => {
    assert.deepStrictEqual(wordle('crane', 'crack'), '/cra[^kc][^k]/');
  });
});
