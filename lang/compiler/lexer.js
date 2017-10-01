
/**
 * Convert mono source into parser friendly tokens.
 *
 * A single token has the following shape:
 *
 * [
 *   type,
 *   value,
 *   locationInformation
 * ]
 *
 * It should be noted that pre-tokenization mono source is transformed
 * to a unified format. This allows us to safely assume the structure
 * of all mono source files are identical & contain valid CSS, enabling
 * easier & faster tokenization.
 */

const chalk = require('chalk'); // temp

const Formatter = require('./formatter');


// token types

const SINGLE_SELECTOR         = 'SINGLE_SELECTOR';   // body
const MULTI_SELECTOR          = 'MULTI_SELECTOR';    // body, html
const INFERRED_SELECTOR       = 'INFERRED_SELECTOR'; // h1.heading<immutable>
const MULTI_INFERRED_SELECTOR = 'INFERRED_SELECTOR'; // h1<immutable>, h2<> || `h1, h2<protected>, h3`
const ESCAPED_SELECTOR        = 'ESCAPED_SELECTOR';  // button.\*btn
const BRACE_OPEN              = 'BRACE_OPEN';        // {
const BRACE_CLOSE             = 'BRACE_CLOSE';       // }
const MEDIA_QUERY             = 'MEDIA_QUERY';       // @media (min-width: 300px) and (max-width: 600px)
const FONT_FACE               = 'FONT_FACE';         // @font-face
const KEYFRAME                = 'KEYFRAME';          // @keyframes
const COMMENT_OPEN            = 'COMMENT_OPEN';      // /*
const COMMENT_CLOSE           = 'COMMENT_CLOSE';     // */
const INLINE_COMMENT          = 'INLINE_COMMENT';    // /* an inline comment */
const DECLARATION             = 'DECLARATION';       // property: value || property<immutable>: value || property<public,?patch('ENG-123')>: value
const LITERAL                 = 'LITERAL';           // most likey a comment


const tokenize = file => {
  const formattedFile = Formatter.format(file);

  console.log(chalk.blue.bold(`Formatted file: ${file.name} --------------- \n`));
  console.log(chalk.grey(formattedFile));

  let tokens = [];
  let lines = formattedFile.split(/\n/);
  let pos = 0;

  while (pos < lines.length) {
    const token = getToken(lines[pos], pos);

    if (token) {
      console.log('token:');
      console.log(token);

      if (token.plural) {
        tokens.push(...token);
      } else {
        tokens.push(token);
      }
    } else {
      console.log('token: in progress');
    }

    pos++;
  }

  console.log('\ntokens:\n')
  console.log(tokens);
}

const getToken = (value, pos) => {
  console.log(`\nvalue: ${value}`);
  console.log(`line: ${pos + 1}`);


  // start with the easy stuff, lines composed of a single token --

  if (justClosingBrace(value)) {
    return closingBrace(pos);
  }

  if (justOpeningComment(value)) {
    return openingComment(pos);
  }

  if (justClosingComment(value)) {
    return closingComment(pos);
  }

  if (justInlineComment(value)) {
    return inlineComment(pos, value);
  }


  // now handle lines containing multiple tokens --

  if (isMediaQuery(value)) {
    return atRule(pos, MEDIA_QUERY, value);
  }

  if (isKeyFrame(value)) {
    return atRule(pos, KEYFRAME, value);
  }

  if (isFontFace(value)) {
    return atRule(pos, FONT_FACE, value);
  }
}

// Token identifiers --

const justClosingBrace = value => {
  // line only contains a closing brace i.e: `}`
  return value.match(/^}$/);
}

const justOpeningComment = value => {
  // line only contains an opening comment i.e: `/*`
  return value.match(/^\/\*$/);
}

const justClosingComment = value => {
  // line only contains a closing comment i.e: `*/`
  return value.match(/^\*\/$/);
}

const justInlineComment = value => {
  // line only contains a comment i.e: `/* line is a just a comment */`
  return value.match(/^\/\*.*\*\/$/);
}

const isMediaQuery = value => {
  // line is a @media at-rule i.e: `@media (min-width: 300px){`
  return value.match(/^@media.*{$/);
}

const isKeyFrame = value => {
  // line is a @keyframes at-rule i.e: `@keyframes bounce {`
  return value.match(/^@keyframes.*{$/);
}

const isFontFace = value => {
  // line is a @font-face at-rule i.e: `@font-face {`
  return value.match(/^@font-face.*{$/);
}


// Tokens --

const closingBrace = pos => {
  return [
    BRACE_CLOSE,
    '}',
    {
      line: pos + 1
    }
  ];
}

const openingComment = pos => {
  return [
    COMMENT_OPEN,
    '/*',
    {
      line: pos + 1
    }
  ];
}

const closingComment = pos => {
  return [
    COMMENT_CLOSE,
    '*/',
    {
      line: pos + 1
    }
  ];
}

const inlineComment = (pos, comment) => {
  return [
    INLINE_COMMENT,
    comment,
    {
      line: pos + 1
    }
  ];
}

/**
 * Get tokens for a given at-rule. Can be:
 * - `@media`
 * - `@keyframe`
 * - `@font-face`
 *
 * An at-rule consists of 2 tokens:
 *
 * 1. the first being the rule i.e: `@keyframes bounce`
 * 2. the second being its opening brace i.e: `{`
 *
 * @param  {Number} pos   - index of current line in file
 * @param  {String} type  - type of at-rule
 * @param  {String} value - fully qualified at-rule (including its open brace)
 * @return {Array}        - 2 tokens
 */
const atRule = (pos, type, value) => {
  const tokens = new Array();
  tokens.plural = true;

  tokens.push(
    [
      type,
      value.replace(/{/, ''),
      {
        line: pos + 1
      }
    ],
    [
      BRACE_OPEN,
      '{',
      {
        line: pos + 1,
        col: value.indexOf('{') + 1
      }
    ]
  );

  return tokens;
}


module.exports = { tokenize }