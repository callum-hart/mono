const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');


const Log = require('./log').parser;
const Config = require('./config');
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

const parseFile = (file) => {
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

  console.log(chalk.blue.bold(`\nFile: ${file.name} --------------- \n`));
  console.log(chalk.gray(`${file.source}\n`));

  console.log(chalk.blue(`Selectors (in ${file.name}) : --------------- \n`));
  const selectors = file.source
                      .replace(/ {/g, '{')   // remove space before opening brace
                      .replace(/,\n/g, ', ') // put multiple selectors on single line
                      .match(/^.*(?={)/gm);  // anything before opening brace

  console.log(selectors);
}

module.exports = {
  run
};