const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk'); // temp

const Log = require('./log').parser;
const Config = require('./config');
const Lexer = require('./lexer');
const { ParserException, TypeException } = require('./exceptions');

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
  let inferredType = false;

  console.log(chalk`\n {blue {bold Start} parsing file: ${file.name} --------------- \n}`);

  // initially generate CSS output without enforcing type-modifier system
  // todo: handle inferred types
  tokens.forEach((token, index) => {
    const prevToken = tokens[index-1]
    const nextToken = tokens[index+1];

    switch (token[0]) {
      case Lexer.BRACE_OPEN:
      case Lexer.MEDIA_QUERY:
      case Lexer.KEYFRAME:
      case Lexer.KEYFRAME_SELECTOR:
      case Lexer.FONT_FACE:
      case Lexer.CHARSET:
      case Lexer.SUPPORTS:
        output += token[1];
        break;
      case Lexer.BRACE_CLOSE:
        output += token[1];
        inferredType = false;
        break;
      case Lexer.DECLARATION:
        const explicitType = token[3] && token[3][0];
        console.log(chalk`{grey token: ${token}}`);

        if (explicitType) {
          console.log(chalk`{green declaration has explicit type: ${explicitType}}`);
        } else if (inferredType) {
          console.log(chalk`{blue declaration has inferred type: ${inferredType}}`);

          if (token[3] === null) {
            token[3] = new Array(4);
          }

          token[3][0] = `${inferredType}<Inferred>`;
        } else {
          console.log(chalk`{red declaration has NO type}`);
        }

        console.log(chalk`{grey token: ${token}}`);
        console.log('-'.repeat(100));

        output += shedNotionIfAny(token)
                    // insert notion comment before semicolon
                    .replace(/;$/, `${notionToComment(token)};`);
        break;
      case Lexer.SELECTOR:
        // either append an open brace or comma depending on whether nextToken is a SELECTOR
        const suffix = nextToken[0] === Lexer.SELECTOR ? ',' : '{';

        if (token[3]) {
          if (prevToken[0] === Lexer.SELECTOR ||
              nextToken[0] === Lexer.SELECTOR) {
            Log.CANNOT_INFER_TYPE(file, token[1], token[3][0]);
            throw new TypeException('Type cannot be inferred by grouped selector');
          } else {
            inferredType = token[3][0];
          }
        }

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
  let comment = BLANK;

  if (token[3]) {
    let notions = [];

    const [
      TYPE,
      MODIFIER,
      MOTIVE,
      CONTEXTUAL_DATA
    ] = token[3];

    if (TYPE) {
      notions.push(TYPE);
    }
    if (MODIFIER) {
      notions.push(MODIFIER);
    }
    if (MOTIVE) {
      notions.push(MOTIVE);
    }
    if (CONTEXTUAL_DATA) {
      notions.push(CONTEXTUAL_DATA);
    }

    comment = ` /* ${notions.join(', ')} */ `;
  }

  return comment;
}

module.exports = {
  run
};