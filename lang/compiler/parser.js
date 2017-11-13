const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk'); // temp

const Log = require('./log').parser;
const Config = require('./config');
const Lexer = require('./lexer');
const { ParserException } = require('./exceptions');

const EXTENSION = '.mono';
const BLANK = '';
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
  let output = '';

  console.log(chalk`\n {blue {bold Start} parsing file: ${file.name} --------------- \n}`);

  // initially generate CSS output without enforcing type-modifier system
  tokens.forEach((token, index) => {
    const nextToken = tokens[index+1];

    switch (token[0]) {
      case Lexer.BRACE_OPEN:
      case Lexer.BRACE_CLOSE:
      case Lexer.MEDIA_QUERY:
      case Lexer.KEYFRAME:
      case Lexer.KEYFRAME_SELECTOR:
      case Lexer.FONT_FACE:
      case Lexer.CHARSET:
      case Lexer.SUPPORTS:
        output += token[1];
        break;
      case Lexer.DECLARATION:
        output += shedNotionIfAny(token);
        break;
      case Lexer.SELECTOR:
        // either append an open brace or comma depending on whether nextToken is a SELECTOR
        const suffix = nextToken[0] === Lexer.SELECTOR ? ',' : '{';
        output += `${shedNotionIfAny(token)}${suffix}`;
        break;
      default:
        return console.log(chalk`{red Unkown token: ${token}}`);
    }
  });

  console.log('start OUTPUT ------------------------------------------\n');
  console.log(chalk`{grey ${output}}`);
  console.log('\nend OUTPUT ------------------------------------------');
  console.log(chalk`\n {red {bold End} parsing file: ${file.name} --------------- \n}`);
}

// remove notion markup & return native CSS
const shedNotionIfAny = (token) => {
  let tokenValue = token[1];

  if (token[3]) {
    // anything within crocodiles <>
    tokenValue = token[1].replace(/<.+>/, BLANK);
  }

  return tokenValue;
}

// construct CSS comment from token containing notion(s) if any
const notionToComment = (token) => {
  console.log('---------------------------');
  console.log(chalk`{grey ${token}}`);

  if (token[3]) {
    const [
      TYPE,
      MODIFIER,
      MOTIVE,
      CONTEXTUAL_DATA
    ] = token[3];

    if (TYPE) {
      console.log(`Type: ${TYPE}`);
    }
    if (MODIFIER) {
      console.log(`Modifier: ${MODIFIER}`);
    }
    if (MOTIVE) {
      console.log(`Motive: ${MOTIVE}`);
      if (CONTEXTUAL_DATA) {
        console.log(`Motive reason: ${CONTEXTUAL_DATA}`);
      }
    }
  } else {
    return token[1];
  }
}

module.exports = {
  run
};