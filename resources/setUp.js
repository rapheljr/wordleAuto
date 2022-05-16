const fs = require('fs');

const { words } = require('../words.js');

const getWord = function (words) {
  return words[randomInt(words.length)];
};

const randomInt = limit => Math.floor(Math.random() * limit);

const writeToFile = (file, content) => fs.writeFileSync(file, content, 'utf8');

const startUpData = function () {
  return {
    word: getWord(words),
    guessedWords: [],
    isGameOver: false
  };
};

const main = function () {
  const data = startUpData();
  writeToFile('./resources/data.json', JSON.stringify(data));
};

main();
