const _ = require('lodash');
const prettier = require('prettier');

const Log = require('./log').formatter;

/**
 * Transform mono source code into a unified format prior to parsing.
 *
 * Despite support for poor formatting it isn't encouraged. Formatting
 * not only makes parsing easier it also reduces friction for onboarding.
 * The focus [of new users] should be on mono design patterns & language
 * features, not trivial things like indentation & spacing.
 *
 * The heavy lifting is outsourced to prettier - which formats mono
 * source code as if it were CSS. Since mono includes non-standard
 * syntax custom formatting is required before & after prettier.
 */


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
    Log.INVALID_CSS(name, e);
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
  return rawNotion.replace(/\s+(?=([^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g, '');
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
          // remove empty lines
          .replace(/^\s*\n/gm, '')

          // put multi-line selectors on single line
          .replace(/,\n/g, ', ')

          // remove space before & after closing > for rule-set types (spaces added by prettier)
          .replace(/<(immutable|protected|public)\s>\s*{/g,'<$1> {')
}

module.exports = { format }