const assert = require('assert');
const { wordleSolver } = require('../src/wordleSolver.js');
const { words } = require('../src/words.js');

describe('wordleSolver', () => {
  it('should give the actual back', () => {
    assert.deepStrictEqual(wordleSolver('crane', 'audio', words), 'crane');
  });
});
