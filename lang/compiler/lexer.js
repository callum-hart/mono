
/**
 * Convert mono source into parser friendly tokens.
 *
 * It should be noted that pre-tokenization mono source is transformed
 * to a unified format. This allows us to safely assume the structure
 * of all mono source files are identical & contain valid CSS, enabling
 * easier & faster tokenization.
 *
 * A single token has the following shape:
 *
 * [
 *   tokenType*,
 *   tokenValue*,
 *   locationData*,
 *   notionData
 * ]
 *
 * locationData: has the shape: [ line*, col ]
 * notionData: (if any notions present) has the shape: [ type, modifier, motive, contextualData ]
 *
 */

const chalk = require('chalk'); // temp

const Formatter = require('./formatter');
const Log = require('./log').lexer;
const { TypeException, ModifierException, MotiveException } = require('./exceptions');


// token types

const BRACE_OPEN              = 'BRACE_OPEN';    // {
const BRACE_CLOSE             = 'BRACE_CLOSE';   // }
const COMMENT_OPEN            = 'COMMENT_OPEN';  // /*
const COMMENT_CLOSE           = 'COMMENT_CLOSE'; // */
const COMMENT                 = 'COMMENT';       // /* a comment */
const MEDIA_QUERY             = 'MEDIA_QUERY';   // @media (min-width: 300px) and (max-width: 600px)
const KEYFRAME                = 'KEYFRAME';      // @keyframes
const FONT_FACE               = 'FONT_FACE';     // @font-face
const CHARSET                 = 'CHARSET';       // @charset
const DECLARATION             = 'DECLARATION';   // property: value || property<immutable>: value || property<public,?patch('ENG-123')>: value
const SELECTOR                = 'SELECTOR';      // a.link
const LITERAL                 = 'LITERAL';       // most likey a comment

// mono notions

const IMMUTABLE               = 'IMMUTABLE';
const PROTECTED               = 'PROTECTED';
const PUBLIC                  = 'PUBLIC';

const MODIFIER_PREFIX         = '@';
const OVERRIDE                = 'OVERRIDE';
const MUTATE                  = 'MUTATE';

const MOTIVE_PREFIX           = '?';
const OVERRULE                = 'OVERRULE';
const OVERTHROW               = 'OVERTHROW';
const VETO                    = 'VETO';
const FALLBACK                = 'FALLBACK';
const BECAUSE                 = 'BECAUSE';
const PATCH                   = 'PATCH';


const tokenize = file => {
  const formattedFile = Formatter.format(file);

  console.log(chalk.blue.bold(`\nFormatted file: ${file.name} --------------- \n`));
  console.log(chalk.grey(formattedFile));

  let tokens = [];
  let lines = formattedFile.split(/\n/);
  let pos = 0;

  while (pos < lines.length) {
    const token = getToken(lines[pos], pos);

    if (token) {
      if (token.plural) {
        tokens.push(...token);
      } else {
        tokens.push(token);
      }
    } else {
      // console.log(`token for '${lines[pos]}' needed`);
    }

    pos++;
  }

  // console.log('\ntokens:\n')
  // console.log(tokens);
}

const getToken = (value, pos) => {

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

  if (justComment(value)) {
    return comment(pos, value);
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

  if (isCharSet(value)) {
    return atRule(pos, CHARSET, value);
  }

  if (isDeclaration(value)) {
    return declaration(pos, value);
  }

  // todo: looks like formatter is appending empty line to each file.
  if (value === '') {
    console.log('EMPTY VALUE');
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

const justComment = value => {
  // line only contains a comment i.e: `/* line is a just a comment */`
  return value.match(/^\/\*.*\*\/$|^\s+\/\*.*\*\/$/);
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

const isCharSet = value => {
  // line is a @charset at-rule i.e: `@charset "UTF-8";`
  return value.match(/^@charset.*;$/);
}

const isDeclaration = value => {
  // line is a CSS declaration i.e: `background-color: rgba(0,0,0,.1);`
  return value.match(/.\S*[^\n]+\s*;/);
}


// Tokens --

const closingBrace = pos => {
  return [
    BRACE_CLOSE,
    '}',
    [ pos + 1 ]
  ];
}

const openingComment = pos => {
  return [
    COMMENT_OPEN,
    '/*',
    [ pos + 1 ]
  ];
}

const closingComment = pos => {
  return [
    COMMENT_CLOSE,
    '*/',
    [ pos + 1 ]
  ];
}

const comment = (pos, comment) => {
  return [
    COMMENT,
    comment,
    [ pos + 1 ]
  ];
}

/**
 * Get token(s) for a given at-rule. Can be:
 *
 * - `@media`
 * - `@keyframe`
 * - `@font-face`
 * - `@charset`
 *
 * An at-rule can consist of 1 or 2 tokens, depending on its type:
 *
 * 1. first token is always the rule i.e: `@keyframes bounce`
 * 2. second [optional] token is an opening brace (if at-rule has one) i.e: `{`
 *
 * @param  {Number} pos   - index of current line in file
 * @param  {String} type  - type of at-rule
 * @param  {String} value - fully qualified at-rule
 * @return {Array}        - array of 1 or 2 tokens
 */
const atRule = (pos, type, value) => {
  const tokens = new Array();

  switch (type) {
    case CHARSET:
      tokens.push(
        CHARSET,
        value,
        [ pos + 1 ]
      );
      break;
    default:
      tokens.plural = true;

      tokens.push(
        [
          type,
          value.replace(/{/, ''),
          [ pos + 1 ]
        ],
        [
          BRACE_OPEN,
          '{',
          [
            pos + 1,
            value.indexOf('{') + 1
          ]
        ]
      );
      break;
  }

  return tokens;
}

const declaration = (pos, value) => {
  try {
    const declaration = value.trim();

    // until first colon
    const property = declaration.match(/.+?(?=:)/)[0];
    const notionData = extractMonoNotion(property);

    console.log(`notionData: ${notionData}`);
    console.log('\n-------------------------\n');

    return [
      DECLARATION,
      declaration,
      [ pos + 1 ],
      notionData
    ];
  } catch (e) {
    switch (e.constructor) {
      case TypeException:
        Log.INVALID_TYPE('todo.mono', pos + 1, value, e.message);
        break;
      case ModifierException:
        Log.INVALID_MODIFIER('todo.mono', pos + 1, value, e.message);
        break;
      case MotiveException:
        Log.INVALID_MOTIVE('todo.mono', pos + 1, value, e.message);
        break;
    }

    throw new Error(e.message);
  }
}

// take a string (CSS property or inferred selector) & return notionData
const extractMonoNotion = string => {
  // anything within crocodiles <>
  const notion = string.match(/<.+>/);
  console.log(`extract notions (if any) from: '${string}'\n`);

  if (notion) {
    const notionData = new Array(4);

    // notion can be plural.
    const notions = notion[0]
                      // remove crocodiles <>
                      .replace(/^\<|\>$/g, '')

                      // replace any comma not within single or double quotes with a delimiter for splitting
                      .replace(/,(?=(?:[^'"]*(['"])[^'"]*\1)*[^'"]*$)/, '🐹')
                      .split('🐹');

    notions.forEach(prospect => {
      const notionType = getNotionIfValid(prospect);

      // todo: represent each notion as a class?
      // Notion
      //  type (byte representation)
      //  value
      // Type extends Notion
      //  value: immutable, protected, public
      //  type: IMMUTABLE, PROTECTED, PUBLIC
      // Modifier extends Notion
      //  value: @override, @mutate
      //  type: OVERRIDE, MUTATE
      // Motive extends Notion
      //  value: ?overrule, ?overthrow, ?patch('eng-123456')
      //  type: OVERRULE, OVERTHROW, PATCH etc...
      //  reason: 'eng-123456'

      switch (notionType) {
        case IMMUTABLE:
        case PROTECTED:
        case PUBLIC:
          notionData[0] = notionType;
          break;
        case OVERRIDE:
        case MUTATE:
          notionData[1] = notionType;
          break;
        case OVERRULE:
        case OVERTHROW:
        case VETO:
        case FALLBACK:
          notionData[2] = notionType;
          break;
        case BECAUSE:
        case PATCH:
          notionData[2] = notionType;
          notionData[3] = getMotiveReason(prospect);
          break;
        default:
          break;
      }
    });

    return notionData;
  }
}

const getNotionIfValid = prospect => {
  switch (prospect.charAt(0)) {
    case MODIFIER_PREFIX:
      return getModidier(prospect);
    case MOTIVE_PREFIX:
      return getMotive(prospect);
    default:
      return getType(prospect);
  }
}

const getModidier = prospect => {
  switch (prospect) {
    case `${MODIFIER_PREFIX}override`:
      return OVERRIDE;
    case `${MODIFIER_PREFIX}mutate`:
      return MUTATE;
    default:
      throw new ModifierException(`'${prospect}' is not a valid modifier`);
  }
}

const getMotive = prospect => {
  const motive = prospect.match(/\?\w+/)[0];

  switch (motive) {
    case `${MOTIVE_PREFIX}overrule`:
      return OVERRULE;
    case `${MOTIVE_PREFIX}overthrow`:
      return OVERTHROW;
    case `${MOTIVE_PREFIX}veto`:
      return VETO;
    case `${MOTIVE_PREFIX}fallback`:
      return FALLBACK;
    case `${MOTIVE_PREFIX}because`:
      return BECAUSE;
    case `${MOTIVE_PREFIX}patch`:
      return PATCH;
    default:
      throw new MotiveException(`'${motive}' is not a valid motive`);
  }
}

const getType = prospect => {
  switch (prospect) {
    case 'immutable':
      return IMMUTABLE;
    case 'protected':
      return PROTECTED;
    case 'public':
      return PUBLIC;
    default:
      throw new TypeException(`'${prospect}' is not a valid type`);
  }
}

const getMotiveReason = (motive) => {
  // content within open & close bracket i.e:
  // `?patch("eng-123")`          -> "eng-123"
  // `?because('align with nav')` -> 'align with nav'
  return motive.replace(/\?\w+\(|\)/, '');
}

module.exports = { tokenize }