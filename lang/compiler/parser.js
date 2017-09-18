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

  console.log(chalk.blue.bold(`\nFormatted file: ${file.name} --------------- \n`));
  formatStyles(file.source);

  /*
    Regex:
    - `.match(/^.*(?={)/gm)` anything before opening brace (can be selector, media query, font-face, keyframe)
  */
}

const formatStyles = (styles) => {
  const formatted = styles
                      .replace(/\s*{/g, '{')   // remove all whitespace before opening brace
                      .replace(/,\n/g, ', ')   // put multiple selectors on single line
                      .replace(/}(.\S)/g, foo)

  // todo: put each declaration on single line .hidden {display: none;} .shown {display: block;}
  // /}(.\S)/
  // /}(.*\S)/g
  // /(}.*\S)/g

  console.log(formatted);
}

module.exports = {
  run
};