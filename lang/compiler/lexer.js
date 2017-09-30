
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
 * to a unified format (see `formatter.js`). This allows us to safely
 * assume the structure of all mono source files are identical & contain
 * valid CSS - enabling easier & faster tokenization.
 */


// token types

const SINGLE_SELECTOR         = 'SINGLE_SELECTOR';   // body
const MULTI_SELECTOR          = 'MULTI_SELECTOR';    // body, html
const INFERRED_SELECTOR       = 'INFERRED_SELECTOR'; // h1.heading<immutable>
const MULTI_INFERRED_SELECTOR = 'INFERRED_SELECTOR'; // h1<immutable>, h2<> || `h1, h2<protected>, h3`
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


const tokenize = monoFile => {
  let tokens = [];
  let lines = monoFile.split(/\n/);
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

  console.log(tokens);
}

const getToken = (value, pos) => {
  const lineNumber = pos + 1;

  console.log(`\nvalue: ${value}`);
  console.log(`lineNumber: ${lineNumber}`);

  // start with the easy stuff, lines containing a single token --

  if (justClosingBrace(value)) {
    return [
      BRACE_CLOSE,
      value,
      {
        lineNumber
      }
    ];
  }

  if (justOpeningComment(value)) {
    return [
      COMMENT_OPEN,
      value,
      {
        lineNumber
      }
    ];
  }

  if (justClosingComment(value)) {
    return [
      COMMENT_CLOSE,
      value,
      {
        lineNumber
      }
    ];
  }

  if (justAComment(value)) {
    return [
      INLINE_COMMENT,
      value,
      {
        lineNumber
      }
    ];
  }


  // now handle lines containing multiple tokens --

  if (isMediaQuery(value)) {
    // a media query consists of 2 tokens:
    // 1. the first being the media query i.e: `@media (min-width: 300px)`
    // 2. the second being its opening brace i.e: `{`

    const tokens = new Array();
    tokens.plural = true;

    tokens.push(
      [
        MEDIA_QUERY,
        value.replace(/{/, ''),
        {
          lineNumber
        }
      ],
      [
        BRACE_OPEN,
        '{',
        {
          lineNumber,
          colPos: value.indexOf('{')
        }
      ]
    );

    return tokens;
  }
}

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

const justAComment = value => {
  // line only contains a comment i.e: `/* line is a just a comment */`
  return value.match(/^\/\*.*\*\/$/);
}

const isMediaQuery = value => {
  // line is a @media rule i.e: `@media (min-width: 300px){`
  return value.match(/^@media.*{$/);
}

const isKeyFrame = value => {}

const isFontFace = value => {}

module.exports = { tokenize }