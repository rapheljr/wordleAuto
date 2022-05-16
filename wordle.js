/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */
/* eslint-disable max-len */
const fs = require('fs');

require('./resources/setUp.js');

const lettersStatus = function (word, guess) {
  const result = [];
  for (let index = 0; index < guess.length; index++) {
    let status = 'absent';
    if (word[index] === guess[index]) {
      status = 'correct';
    } else if (word.includes(guess[index])) {
      status = 'present';
    }
    result.push([guess[index], status]);
  }
  return result;
};

const appendGuessedWord = function (guessedWords, wordResult) {
  guessedWords.push(wordResult);
  return guessedWords;
};

const generateTag = (tag, content, property) => {
  let style = '';
  if (property) {
    style = ' class="' + property + '"';
  }
  return '<' + tag + style + '>' + content + '</' + tag + '>';
};

const writeToJson = (file, content) =>
  fs.writeFileSync(file, JSON.stringify(content), 'utf8');

const writeToFile = (file, content) =>
  fs.writeFileSync(file, content, 'utf8');

const generateLetter = ([letter, status]) =>
  generateTag('div', letter, status);

const generateWord = letters =>
  generateTag('div', letters.map(generateLetter).join(''), 'word');

const emptyRow = numOfCells => {
  let row = '';
  for (let index = 0; index < numOfCells; index++) {
    row += generateTag('div', '', '');
  }
  return generateTag('div', row, 'word');
};

const emptyRows = numOfRows => {
  const rows = [];
  for (let index = 0; index < numOfRows; index++) {
    rows.push(emptyRow(5));
  }
  return rows;
};

const wordleTable = function (prevAttempts) {
  const generatedWords = prevAttempts.map(generateWord);
  const attemptsLeft = 6 - prevAttempts.length;
  const generatedEmptyRows = emptyRows(attemptsLeft);
  return generatedWords.concat(generatedEmptyRows).join('');
};

const readFile = filePath => fs.readFileSync(filePath, 'utf8');

const generatePage = function (table, message, templateAsString) {
  return templateAsString.replace(/_GUESSED-WORDS_/, table).replace(/_MESSAGE_/, message);
};

const getMessage = function (data, guess) {
  if (data.word === guess) {
    data.isGameOver = true;
    return 'CONGRATULATIONS!!! You got it right';
  }
  if (data.guessedWords.length === 6) {
    data.isGameOver = true;
    return 'OOPS!!! Better luck next time. Correct word was ' + data.word;
  }
  return '';
};

const main = function (guess, dataFile, template) {
  const data = JSON.parse(readFile(dataFile));
  const templateAsString = readFile(template);
  let prevAttempts = data.guessedWords;

  const wordResult = lettersStatus(data.word, guess);
  prevAttempts = appendGuessedWord(prevAttempts, wordResult);

  const message = getMessage(data, guess);
  writeToJson(dataFile, data);
  const webpage = generatePage(wordleTable(prevAttempts), message, templateAsString);
  writeToFile('./index.html', webpage);
};

exports.main = main;
