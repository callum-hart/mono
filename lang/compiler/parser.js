const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');

const Log = require('./log').parser;
const Config = require('./config');
const Formatter = require('./formatter');
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

  console.log(chalk.blue.bold(`\nFormatted file: ${file.name} --------------- \n`));
  console.log(chalk.gray(formattedFile));

  const lexemes = formattedFile.match(/^.*(?= {)/gm);



  /*
  determine each lexeme type, can be:
  - selector
    - must have element type, if not throw ParserException
  - inferred selector
    - must have element type, if not throw ParserException
    - must have be a valid type, if not throw ParserException
  - grouped selector
    - each must have element type, if not throw ParserException
  - media query
  - font face
  - key frame

  example ast of file:

  [
    {
      type: "RULE_SET",
      selector: "body.main",
      elementType: "body",
      specificityScore: ,
      cascadeOrder: 1,
      declarations: []
    },
    {
      type: "INFERRED_RULE_SET",
      selector: "ul<immutable>",
      elementType: "ul",
      specificityScore: ,
      cascadeOrder: 2,
      inferredType: "immutable",
      declarations: []
    },
    {
      type: "GROUPED_RULE_SET",
      selectors: [
        "div.title",
        "section.foo > a.bar",
        "span#label"
      ],
      elementTypes: [
        "div",
        "a",
        "span"
      ],
      cascadeOrder: 3,
      specificityScores: [],
      declarations: []
    },
    {
      type: "MEDIA_QUERY",
      ruleSets: [
        {
          type: "RULE_SET",
          selector: "p.something",
          elementType: "p",
          specificityScore: ,
          cascadeOrder: 5,
          declarations: []
        },
        {
          type: "INFERRED_RULE_SET",
          selector: "h1<protected>",
          elementType: "h1",
          specificityScore: ,
          cascadeOrder: 6,
          inferredType: "immutable",
          declarations: []
        }
      ]
    }
  ]
  */

  lexemes.forEach(lexeme => {
    console.log(lexeme);
  });
}

module.exports = {
  run
};