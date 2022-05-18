/* eslint-disable no-magic-numbers */
const fs = require('fs');

const { words } = require('./words.js');

const readFile = function (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw filePath + ' not found';
  }
};

const memoryFile = 'resources/memory.json';
const memory = readFile(memoryFile);
const data = JSON.parse(memory);

const getNextWord = function () {
  data.word = words[data.index + 1];
  data.index = data.index + 1;
  return words[data.index];
};

const writeToFile = (file, content) => fs.writeFileSync(file, content, 'utf8');

const startUpData = function () {
  return {
    word: getNextWord(),
    guessedWords: [],
    isGameOver: false
  };
};

const main = function () {
  const setup = startUpData();
  writeToFile('resources/data.json', JSON.stringify(setup));
  writeToFile(memoryFile, JSON.stringify(data));
};

main();

exports.readFile = readFile;
