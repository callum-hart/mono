
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

const BRACE_OPEN              = 'BRACE_OPEN';         // {
const BRACE_CLOSE             = 'BRACE_CLOSE';        // }
const COMMENT_OPEN            = 'COMMENT_OPEN';       // /*
const COMMENT_CLOSE           = 'COMMENT_CLOSE';      // */
const COMMENT                 = 'COMMENT';            // /* a comment */
const MEDIA_QUERY             = 'MEDIA_QUERY';        // @media (min-width: 300px) and (max-width: 600px)
const KEYFRAME                = 'KEYFRAME';           // @keyframes
const KEYFRAME_SELECTOR       = 'KEYFRAME_SELECTOR';  // from, to, 0-100%
const FONT_FACE               = 'FONT_FACE';          // @font-face
const CHARSET                 = 'CHARSET';            // @charset
const DECLARATION             = 'DECLARATION';        // property: value || property<immutable>: value || property<public,?patch('ENG-123')>: value
const SELECTOR                = 'SELECTOR';           // a.link
const LITERAL                 = 'LITERAL';            // most likey a comment

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

let currentFile;

const tokenize = file => {
  currentFile = file;
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
      console.log(`token for '${lines[pos]}' needed`);
    }

    pos++;
  }

  console.log('\ntokens:\n')
  console.log(tokens);
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

  if (isKeyFrameSelector(value)) {
    return keyFrameSelector(pos, value);
  }

  if (isSelector(value)) {
    return selector(pos, value);
  }

  // todo: looks like formatter is appending empty line to each file.
  if (value === '') {
    console.log(`empty value found at pos: ${pos}`);
  }
}

// Token identifiers --

const justClosingBrace = value => {
  // line only contains a closing brace i.e: `}`
  return value.match(/}$/);
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
  // line is a comment i.e: `/* line is a just a comment */`
  // todo: line ending with */
  return value.match(/^\/\*|^\/\*.*\*\/$|^\s+\/\*.*\*\/$/);
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

const isKeyFrameSelector = value => {
  // line is a keyframe-selector (from, to, 0-100%) i.e: `from {`
  return value.match(/from{|to{|\d{1,3}%{/);
}

const isSelector = value => {
  // line is a selector, canbe be part of multiple selector i.e: `a.link {` or `a.link,`
  return value.match(/.+{|.+,/);
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

    return [
      DECLARATION,
      declaration,
      [ pos + 1 ],
      getNotionIfAny(property)
    ];
  } catch (e) {
    e.log.call(undefined, currentFile, value, e.offender);
    throw new Error(e.message);
  }
}

const keyFrameSelector = (pos, value) => {
  return [
    KEYFRAME_SELECTOR,
    value.trim(),
    [ pos + 1 ]
  ];
}

const selector = (pos, value) => {
  try {
    const selector = value
                      .trim()
                      .replace(/{/, '')
                      .replace(/,/, '');

    console.log(`todo: validate selector: '${selector}' (must be or contain HTML element)`);

    return [
      SELECTOR,
      selector,
      [ pos + 1 ],
      getSelectorNotionIfAny(selector)
    ];
  } catch (e) {
    e.log.call(undefined, currentFile, value, e.offender);
    throw new Error(e.message);
  }
}

// Helpers --


/**
 * Extract mono notion from string, where string can be:
 *
 * - CSS property
 * - CSS Selector
 *
 * @param  {String} string - string potentially containing a notion
 * @return {(Array<notionData> |null)} notion data, or null when no notions found i.e:
 *   - `font-size`                              -> null
 *   - `color<immutable>`                       -> [ IMMUTABLE, , ,]
 *   - `background-color<@override>`            -> [ , OVERRIDE, ,]
 *   - `height<protected,?patch('eng-123')>`    -> [ PROTECTED , , PATCH, 'eng-123']
 *   - `h3.title`                               -> null
 *   - `div.inferredRuleSet<immutable>`         -> [ IMMUTABLE, , , ]
 */
const getNotionIfAny = string => {
  // anything within crocodiles <>
  const notion = string.match(/<.+>/);

  if (notion) {
    const notionData = new Array(4);

    // notion can be plural.
    const notions = notion[0]
                      // remove crocodiles <>
                      .replace(/^\<|\>$/g, '')

                      // replace any comma (not within single or double quotes) with delimiter for splitting
                      .replace(/,(?=(?:[^'"]*(['"])[^'"]*\1)*[^'"]*$)/, '🐹')
                      .split('🐹');

    notions.forEach(prospect => {
      const notionType = getNotionIfValid(prospect);

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
  } else {
    return null;
  }
}

/**
 * Extract type from inferred rule-set.
 *
 * @param  {String} selector - CSS selector potentially containing inferred notion
 * @throws {(ModifierException | MotiveException)} If inferred notion is a modifier or motive
 * @return {(Array<notionData> | null)} notion data, or null when no inferred type is found
 */
const getSelectorNotionIfAny = selector => {
  const notionData = getNotionIfAny(selector);

  if (notionData[1]) {
    throw new ModifierException(`'${selector}' cannot infer modifiers`, `@${notionData[1]}`, Log.INFERRED_NOTION_MISUSE);
  }

  if (notionData[2]) {
    throw new MotiveException(`'${selector}' cannot infer motives`, `?${notionData[2]}`, Log.INFERRED_NOTION_MISUSE);
  }

  return notionData;
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
      throw new ModifierException(`'${prospect}' is not a valid modifier`, prospect, Log.UNKNOWN_MODIFIER);
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
      throw new MotiveException(`'${motive}' is not a valid motive`, motive, Log.UNKNOWN_MOTIVE);
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
      throw new TypeException(`'${prospect}' is not a valid type`, prospect, Log.UNKNOWN_TYPE);
  }
}

/**
 * Get user-inputted reason from motives:
 *
 * - `?because`
 * - `?patch`
 *
 * @param  {String} motive - fully qualified motive
 * @return {String} the reason, i.e:
 *   - `?because('align with nav')`  -> 'align with nav'
 *   - `?patch("eng-123456")`        -> "eng-123456"
 * @throws MotiveException when reason isn't provided.
 */
const getMotiveReason = (motive) => {
  if (motive.includes('(') && motive.includes(')')) {
    // content within open and close bracket i.e:
    return motive.replace(/\?\w+\(|\)$/g, '');
  } else {
    throw new MotiveException(`${motive} is missing reason`, motive, Log.MOTIVE_WITHOUT_REASON);
  }
}

module.exports = { tokenize }