/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */

const { log } = console;
const fs = require('fs');
const { words } = require('./words.js');
const { main } = require('./wordle.js');

const dataFile = './resources/data.json';
const template = './resources/template.html';

const randomNumber = function (range) {
  const random = Math.random() * range;
  return Math.floor(random);
};

const getWord = function (words) {
  return words[randomNumber(words.length)];
};

const wordle = function (actual, guess) {
  const exact = [];
  const included = [];
  const notIncluded = [];
  if (actual.length !== guess.length) {
    return [exact, included, notIncluded];
  }
  guess.split('').reduce(function (context, element, index) {
    if (element === actual[index]) {
      exact.push([index, element]);
    } else if (actual.includes(element)) {
      included.push([index, element]);
    } else {
      notIncluded.push(element);
    }
    return context;
  }, 0);
  return [exact, included, notIncluded];
};

const filter = function (words, data, reducer) {
  return words.filter(function (word) {
    return data.reduce(reducer(word), true);
  });
};

const findWords = function (word) {
  return function (context, element) {
    const result = word[element[0]] === element[1];
    return context ? context === result : false;
  };
};

const excludeWords = function (word) {
  return function (context, element) {
    const result = !word.includes(element);
    return context ? context === result : false;
  };
};

const ignoreWords = function (word) {
  return function (context, element) {
    let result = word[element[0]] !== element[1];
    result = word.includes(element[1]) && result;
    return context ? context === result : false;
  };
};

const wordAuto = function (actual, guess, words) {
  log(actual, guess);
  main(guess, dataFile, template);
  if (actual === guess) {
    return actual;
  }
  const [exact, included, notIncluded] = wordle(actual, guess);
  let filtered = filter(words, notIncluded, excludeWords);
  filtered = filter(filtered, included, ignoreWords);
  filtered = filter(filtered, exact, findWords);
  return wordAuto(actual, getWord(filtered), filtered);
};

const readFile = filePath => fs.readFileSync(filePath, 'utf8');

let data = readFile(dataFile);
data = JSON.parse(data);

log(wordAuto(data.word, getWord(words), words));
