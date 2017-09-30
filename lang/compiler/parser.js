const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

const Log = require('./log').parser;
const Config = require('./config');
const Formatter = require('./formatter');
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
  const formattedFile = Formatter.format(file);

  console.log(chalk.blue.bold(`Formatted file: ${file.name} --------------- \n`));
  console.log(chalk.grey(formattedFile));
  const tokens = Lexer.tokenize(formattedFile);

  // while (tokens.present()) {
  //   // const token = tokens.next();
  //   // switch (token[0]) {}
  // }
}

module.exports = {
  run
};