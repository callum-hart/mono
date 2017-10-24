
/**
 * Transform mono source code into a unified format prior to parsing.
 *
 * Despite support for poor formatting it isn't encouraged. Formatting
 * not only makes parsing easier it also reduces friction for onboarding.
 * The focus of newcomers should be on mono design patterns & language
 * features; not trivial things like indentation & spacing.
 *
 * The heavy lifting is outsourced to prettier - which formats mono
 * source code as if it were CSS. Since mono includes non-standard
 * syntax custom formatting is required before & after prettier.
 *
 * Under the hood prettier uses postcss which provides CSS validation
 * for free.
 */


const _ = require('lodash');
const prettier = require('prettier');

const Log = require('./log').formatter;
const { CSSException } = require('./exceptions');


/**
 * {Public} format
 *
 * Format mono source file.
 *
 * @param {String} name - name of mono source file
 * @param {String} source - mono source code
 * @return {String} formatted mono source code
 */
const format = ({name, source} = file) => {
  try {
    return formatPrettierOutput(prettier.format(formatMonoNotions(source), { parser: 'postcss'}));
  } catch (e) {
    Log.INVALID_CSS(name, source, e);
    throw new CSSException('Invalid CSS detected');
  }
}

/**
 * {Private} formatMonoNotions
 *
 * Cleanup mono notions (types, inferred types, modifiers, motives).
 *
 * @param  {String} styles - raw mono soruce code
 * @return {String} source code with mono notions reformatted
 */
const formatMonoNotions = styles => {
  // anything between crocodiles <>
  let monoNotions = styles.match(/<\s*[^\n]+\s*>/g);

  if (!_.isEmpty(monoNotions)) {
    monoNotions.forEach(notion => styles = styles.replace(notion, formatMonoNotion(notion)));
  }

  return styles;
}

/**
 * {Private} formatMonoNotion
 *
 * Remove whitespace from mono notions, whilst preserving whitspace within quotes.
 * Motives such as `?because` can contain spaces as part of the reason. For example:
 * `<?because: 'align content with nav'>`.
 *
 * @param  {String} rawNotion - mono notion
 * @return {String} reformatted mono notion
 */
const formatMonoNotion = rawNotion => {
  // remove whitespace not within single or double quotes
  return rawNotion.replace(/\s+(?=(?:[^'"]*(['"])[^'"]*\1)*[^'"]*$)/g, '');
}

/**
 * {Private} formatPrettierOutput
 *
 * Transform prettier output.
 *
 * @param  {String} prettierOutput - mono source code formatted by prettier as if it were CSS.
 * @return {String} clean version of prettier output.
 */
const formatPrettierOutput = prettierOutput => {
  return prettierOutput
          // remove single & multi-line comments
          .replace(/\/\*([\s\S]*?)\*\//gm, '')

          // remove empty lines
          .replace(/^\s*\n/gm, '')

          // remove space(s) before opening brace
          .replace(/\s*{/g, '{')

          // put multi-line declarations onto single line
          .replace(/\(\n\s+|,\n\s+|\s+(?=\);)/gm, match => match.replace(/\s+/gm, ''))

          // remove space(s) from inferred notions
          .replace(/<\s+|\s+>{|\s+>.,/g, match => match.replace(/\s/g, ''))

          // remove newline(s) from inferred notions
          .replace(/<([\s\S]*?)>/g, match => match.replace(/\n/g, ''))
}

module.exports = { format }