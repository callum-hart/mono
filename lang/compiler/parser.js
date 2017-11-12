const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk'); // temp

const Log = require('./log').parser;
const Config = require('./config');
const Lexer = require('./lexer');
const { ParserException } = require('./exceptions');

const EXTENSION = '.mono';
let ast = {
  files: [],
}

const run = () => {
  try {
    Config.getSrc().forEach((file, order) => {
      const name = _.endsWith(file, EXTENSION) ? file : `${file}${EXTENSION}`;
      const source = fs.readFileSync(`${process.cwd()}/${name}`).toString();

      ast.files.push({
        name,
        order,
        source
      });
    });
  } catch (e) {
    Log.PARSER_ERROR(e);
    throw new ParserException('Failed to run parser');
  }

  parse();
}

const parse = () => {
  ast.files.forEach(file => parseFile(file));
}

const parseFile = file => {
  const tokens = Lexer.tokenize(file);

  console.log(chalk`\n {green {bold Start} parsing file: ${file.name} --------------- \n}`);

  // initially generate CSS output without enforcing type-modifier system
  for (const token of tokens) {
    console.log(token);
    console.log('-------------------------');
  }

  console.log(chalk`\n {red {bold End} parsing file: ${file.name} --------------- \n}`);
}

module.exports = {
  run
};