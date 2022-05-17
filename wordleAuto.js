const fs = require('fs');
const { log } = console;
const { words } = require('./words.js');
const { main } = require('./wordle.js');

const dataFile = './resources/data.json';
const template = './resources/template.html';

const randomNumber = range => Math.floor(Math.random() * range);

const getWord = words => words[randomNumber(words.length)];

const filter = function (words, regEx) {
  return words.filter(function (word) {
    return regEx.test(word);
  });
};

const wordle = function (actual, guess) {
  let regEx = '/';
  let notIncluded = '';
  guess.split('').forEach(function (element, index) {
    if (element === actual[index]) {
      regEx += element;
    } else if (actual.includes(element)) {
      regEx += '[^' + element + ']';
    } else {
      regEx += '.';
      notIncluded += element;
    }
    return element;
  });
  regEx = regEx.replaceAll('^', '^' + notIncluded);
  regEx = regEx.replaceAll('.', '[^' + notIncluded + ']');
  return regEx + '/';
};

const wordleAuto = function (actual, guess, words) {
  log(actual, guess);
  main(guess, dataFile, template);
  if (actual === guess) {
    return actual;
  }
  const regEx = wordle(actual, guess);
  const filtered = filter(words, eval(regEx));
  // log(filtered);
  return wordleAuto(actual, getWord(filtered), filtered);
};

const readFile = filePath => fs.readFileSync(filePath, 'utf8');

let data = readFile(dataFile);
data = JSON.parse(data);

log(wordleAuto(data.word, getWord(words), words));
