const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const prettier = require('prettier');


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

  console.log(chalk.blue.bold(`\nFormatted file: ${file.name} --------------- \n`));
  console.log(chalk.gray(formatStyles(file.source)));

  /*
  `preOpenBrace`: anything before opening brace, can be:
  - selector
  - media query
  - font face
  - key frame
  */
  const preOpenBrace = formatStyles(file.source).match(/^.*(?={)/gm);
  console.log(chalk.blue(`preOpenBrace (anything before opening brace): --------------- \n`));
  console.log(preOpenBrace);
}

/*
Could either report code smells 👃, or reformat them before parsing.

Trade off between flexibility (by supporing liberal formatting) and consistency
(by enforcing formatting rules), either way need to be able to detect code smells.

Currently outsourcing formatting to prettier. It appears to handle mono notions
out of the box. Will need to keep an eye on this. Some observations:
- spacing added either side of > by types inferred by rule-set, i.e:
    - src: `ul<immutable> {`
    - out: `ul<immutable >  {`
- space after comma in combinators doesn't work, i.e:
    - `display<protected, ?overrule>: none;` => `display<protected,: none;`
    - `display<protected,?overrule>: none;`  => `display<protected,?overrule>: none;` (no space works)
*/
const formatStyles = rawStyles => {
  // todo: log prettier formatting errors to console
  return postPrettier(prettier.format(prePrettier(rawStyles), { parser: 'postcss' }));
}

/**
 * Format styles before running prettier.
 *
 */
const prePrettier = rawStyles => {
  // Todo: remove whitespace after comma in combinators, i.e
  // - src: display<protected, ?overrule>
  // - out: display<protected,?overrule>

  return rawStyles;
}

/**
 * Format styles after running prettier.
 */
const postPrettier = formattedStyles => {
  return formattedStyles
          .replace(/\s*{/g, '{')                        // remove whitespace(s) before opening brace
          .replace(/,\n/g, ', ')                        // put multi-line selectors on single line
          .replace(/^\s*\n/gm, '')                      // remove empty lines
          .replace(/<\s*immutable\s*>/g, `<immutable>`) // remove whitespace(s) before & after inferred rule-set type
          .replace(/<\s*protected\s*>/g, `<protected>`) // remove whitespace(s) before & after inferred rule-set type
          .replace(/<\s*public\s*>/g, `<public>`)       // remove whitespace(s) before & after inferred rule-set type
}

module.exports = {
  run
};