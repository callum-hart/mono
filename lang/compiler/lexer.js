
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
const HTML_ELEMENTS = require('./htmlElements');
const {
  AbstractNotionException,
  TypeException,
  ModifierException,
  MotiveException,
  SelectorException
} = require('./exceptions');


// token types

const BRACE_OPEN              = 'BRACE_OPEN';             // {
const BRACE_CLOSE             = 'BRACE_CLOSE';            // }
const MEDIA_QUERY             = 'MEDIA_QUERY';            // @media (min-width: 300px) and (max-width: 600px)
const KEYFRAME                = 'KEYFRAME';               // @keyframes
const KEYFRAME_SELECTOR       = 'KEYFRAME_SELECTOR';      // from, to, 0-100%
const FONT_FACE               = 'FONT_FACE';              // @font-face
const CHARSET                 = 'CHARSET';                // @charset
const DECLARATION             = 'DECLARATION';            // property: value || property<immutable>: value || property<public,?patch('ENG-123')>: value
const SELECTOR                = 'SELECTOR';               // a.link

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


const BLANK                   = '';
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

  if (isClosingBrace(value)) {
    return closingBrace(pos);
  }

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
  if (value === BLANK) {
    console.log(`empty value found at pos: ${pos}`);
  }
}

// Token identifiers --

const isClosingBrace = value => {
  // line only contains a closing brace i.e: `}`
  return value.match(/}$/);
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
          value.replace(/{/, BLANK),
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
  } catch (error) {
    error.log.call(undefined, currentFile, value, error.offender);
    throw new error.constructor(error.message);
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
                      .replace(/{/, BLANK)
                      .replace(/,$/, BLANK); // comma could exist in notion combinator i.e: `immutable,?veto`

    if (selectorIsValid(selector)) {
      return [
        SELECTOR,
        selector,
        [ pos + 1 ],
        getSelectorNotionIfAny(selector)
      ]
    }
  } catch (error) {
    error.log.call(undefined, currentFile, value, error.offender);
    throw new error.constructor(error.message);
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
                      .replace(/^\<|\>$/g, BLANK)

                      // replace any comma (not within single or double quotes) with delimiter for splitting
                      .replace(/,(?=(?:[^'"]*(['"])[^'"]*\1)*[^'"]*$)/g, '🐹')
                      .split('🐹');

    notions.forEach(prospect => {
      const notionType = getNotionIfValid(prospect);

      switch (notionType) {
        case IMMUTABLE:
        case PROTECTED:
        case PUBLIC:
          if (notionData[0]) {
            throw new TypeException(
              `${string} already assigned the type ${notionData[0]}`,
              notionType,
              Log.TYPE_ALREADY_DECLARED
            );
          } else {
            notionData[0] = notionType;
          }
          break;
        case OVERRIDE:
        case MUTATE:
          if (notionData[1]) {
            throw new ModifierException(
              `${string} already assigned the modifier ${notionData[1]}`,
              `${MODIFIER_PREFIX}${notionType}`,
              Log.MODIFIER_ALREADY_DECLARED
            );
          } else {
            notionData[1] = notionType;
          }
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

  if (notionData) {
    if (notionData[1]) {
      throw new ModifierException(
        `${selector} cannot infer modifiers`,
        `${MODIFIER_PREFIX}${notionData[1]}`,
        Log.CANNOT_INFER_MODIFIER
      );
    }

    if (notionData[2]) {
      throw new MotiveException(
        `${selector} cannot infer motives`,
        `${MOTIVE_PREFIX}${notionData[2]}`,
        Log.CANNOT_INFER_MOTIVE
      );
    }
  }

  return notionData;
}

/**
 * Extract notion from string.
 *
 * @param  {String} string - string containing a notion
 * @throws {AbstractNotionException} If notion is blank
 * @return {String} the notion type
 */
const getNotionIfValid = prospect => {
  if (prospect) {
    switch (prospect.charAt(0)) {
      case MODIFIER_PREFIX:
        return getModidier(prospect);
      case MOTIVE_PREFIX:
        return getMotive(prospect);
      default:
        return getType(prospect);
    }
  } else {
    throw new AbstractNotionException(
      'Trailing comma found in combinator',
      `${prospect},>`,
      Log.MISSING_NOTION
    );
  }
}

/**
 * Determine modifier type.
 *
 * @param  {String} prospect - string potentially containing a modifier
 * @throws {ModifierException} If modifier is invalid
 * @return {String} the modifier type
 */
const getModidier = prospect => {
  switch (prospect) {
    case `${MODIFIER_PREFIX}override`:
      return OVERRIDE;
    case `${MODIFIER_PREFIX}mutate`:
      return MUTATE;
    default:
      throw new ModifierException(
        `${prospect} is not a valid modifier`,
        prospect,
        Log.UNKNOWN_MODIFIER
      );
  }
}

/**
 * Determine motive type.
 *
 * @param  {String} prospect - string potentially containing a motive
 * @throws {MotiveException} If motive is invalid
 * @return {String} the motive type
 */
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
      throw new MotiveException(
        `${motive} is not a valid motive`,
        motive,
        Log.UNKNOWN_MOTIVE
      );
  }
}

/**
 * Determine types type.
 *
 * @param  {String} prospect - string potentially containing a type
 * @throws {TypeException} If type is invalid
 * @return {String} the types type
 */
const getType = prospect => {
  switch (prospect) {
    case 'immutable':
      return IMMUTABLE;
    case 'protected':
      return PROTECTED;
    case 'public':
      return PUBLIC;
    default:
      throw new TypeException(
        `${prospect} is not a valid type`,
        prospect,
        Log.UNKNOWN_TYPE
      );
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
    return motive.replace(/\?\w+\(|\)$/g, BLANK);
  } else {
    throw new MotiveException(
      `${motive} is missing a reason`,
      motive,
      Log.MOTIVE_WITHOUT_REASON
    );
  }
}

/**
 * Determine whether a CSS selector is valid.
 *
 * @param  {String} CSS selector
 * @return {True} if selector contains valid HTML element type(s)
 * @throws {SelectorException} When:
 *  - HTML element is missing, or
 *  - An invalid HTML element is used
 */
const selectorIsValid = (selector) => {
  const fragments = selector
                      .replace(/<.+>/, BLANK)      // remove mono notions
                      .replace(/\+|\~|\>/g, BLANK) // remove characters used by combinators
                      .replace(/\*/g, BLANK)       // remove universal selectors
                      .trim()
                      .split(/\s+/);

  console.log(`selector: ${selector}`);
  console.log(`fragments: ${fragments}`);

  fragments.forEach(fragment => {
    // element or element preceding class, ID, attribute, pseudo-class or pseudo-element
    const elementIfAny = fragment.match(/^\w+$|^\w+(?=\.)|^\w+(?=#)|^\w+(?=\[)|^\w+(?=:)/);

    console.log(`fragment: ${fragment}`);

    if (elementIfAny) {
      if (HTML_ELEMENTS.includes(elementIfAny[0])) {
        console.log(chalk`fragment: {bold ${fragment}} is or contains a valid HTML element`);
      } else {
        throw new SelectorException(
          `${elementIfAny[0]} is not a valid element type`,
          elementIfAny[0],
          Log.INVALID_ELEMENT_TYPE
        );
      }
    } else {
      throw new SelectorException(
        `${fragment} is missing element type`,
        fragment,
        Log.MISSING_ELEMENT_TYPE
      );
    }
  });

  console.log(chalk`{grey ----------------------------}`);

  return true;
}

module.exports = { tokenize }