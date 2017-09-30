
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
 * It should be noted that pre tokenization mono source is transformed
 * to a unified format (see `formatter.js`). This allows us to safely
 * assume the structure of all mono source files are identical; enabling
 * easier & faster tokenization.
 */


// token types

const SINGLE_SELECTOR         = 'SINGLE_SELECTOR';   // body
const MULTI_SELECTOR          = 'MULTI_SELECTOR';    // body, html
const INFERRED_SELECTOR       = 'INFERRED_SELECTOR'; // h1.heading<immutable>
const MULTI_INFERRED_SELECTOR = 'INFERRED_SELECTOR'; // h1<immutable>, h2<> || `h1, h2<protected>, h3`
const BRACE_OPEN              = 'BRACE_OPEN';        // {
const BRACE_CLOSE             = 'BRACE_CLOSE';       // {
const MEDIA_QUERY             = 'MEDIA_QUERY';       // @media (min-width: 300px) and (max-width: 600px)
const FONT_FACE               = 'FONT_FACE';         // @font-face
const KEYFRAME                = 'KEYFRAME';          // @keyframes
const COMMENT_OPEN            = 'COMMENT_OPEN';      // /*
const COMMENT_CLOSE           = 'COMMENT_CLOSE';     // */
const DECLARATION             = 'DECLARATION';       // property: value || property<immutable>: value || property<public,?patch('ENG-123')>: value
const LITERAL                 = 'LITERAL';           // most likey a comment


const tokenize = monoFile => {
  let tokens = [];
  let lines = monoFile.split(/\n/);

  lines.forEach((line, i, arr) => {
    console.log(`line: ${line}`);
    console.log(`line number: ${i + 1}\n`);

    // a line can contain multiple tokens i.e:
    // the line `p.foo{` contains the tokens `p.foo` and `{`
    console.log(`tokens: ${determineToken(line)}`);
  });
}

const determineToken = value => {
  return 'in progress';
}

module.exports = { tokenize }