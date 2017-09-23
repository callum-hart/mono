const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

const Log = require('./log').parser;
const Config = require('./config');
const Formatter = require('./formatter');

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

    parse();
  } catch (e) {
    Log.SOURCE_ERROR(e);
  }
}

const parse = () => {
  ast.files.forEach(file => parseFile(file));
}

const parseFile = file => {
  /*
  todo: parse each file, adding to ast:
  - rule-sets
      selector
      styles
      order (in file)
  - media queries
    - breakpoints
    - order (in file)
    - rule-sets
  */

  const formattedFile = Formatter.format(file.source);

  console.log(chalk.blue.bold(`\nFormatted file: ${file.name} --------------- \n`));
  console.log(chalk.gray(formattedFile));

  /*
  `preOpenBrace`: anything before opening brace, can be:
  - selector
  - media query
  - font face
  - key frame
  */
  const preOpenBrace = formattedFile.match(/^.*(?={)/gm);
  console.log(chalk.blue(`Anything preceding opening brace: --------------- \n`));
  console.log(preOpenBrace);
}

module.exports = {
  run
};