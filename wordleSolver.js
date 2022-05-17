/* eslint-disable no-eval */
const { words } = require('./words.js');
const { main, readFile } = require('./wordle.js');

const dataFile = './resources/data.json';
const template = './resources/template.html';

const randomNumber = range => Math.floor(Math.random() * range);

const getWord = words => words[randomNumber(words.length)];

const filter = function (words, regEx) {
  return words.filter(function (word) {
    return regEx.test(word);
  });
};

const generateRegEx = function (text, actual, expected) {
  const anyMatch = '.';
  if (actual === expected) {
    return actual;
  }
  if (text.includes(actual)) {
    return '[^' + actual + ']';
  }
  return anyMatch;
};

const notIncluded = function (actual, guess) {
  return guess.split('').filter(function (element) {
    return !actual.includes(element);
  }).join('');
};

const wordle = function (actual, guess) {
  let regEx = '/';
  const not = notIncluded(actual, guess);
  guess.split('').forEach(function (element, index) {
    regEx += generateRegEx(actual, element, actual[index]);
    return element;
  });
  regEx = regEx.replaceAll('^', '^' + not);
  regEx = regEx.replaceAll('.', '[^' + not + ']');
  return regEx + '/';
};

const wordleSolver = function (actual, guess, words) {
  console.log(actual, guess);
  main(guess, dataFile, template);
  if (actual === guess) {
    return actual;
  }
  const regEx = wordle(actual, guess);
  const filtered = filter(words, eval(regEx));
  return wordleSolver(actual, getWord(filtered), filtered);
};

let data = readFile(dataFile);
data = JSON.parse(data);

console.log(wordleSolver(data.word, getWord(words), words));
