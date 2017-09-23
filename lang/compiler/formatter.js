const _ = require('lodash');
const prettier = require('prettier');


/**
 * {Public} format
 *
 * Format mono source file.
 *
 * @param {String} styles - raw mono source code
 * @return {String} formatted mono source code
 */
const format = styles => {
  return formatPrettierOutput(prettier.format(formatMonoNotions(styles), { parser: 'postcss'}));
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
  let monoNotions = styles.match(/<\s*[^\n]+\s*>/g); // anything between crocodiles <>

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
          .replace(/^\s*\n/gm, '')                             // remove empty lines
          .replace(/,\n/g, ', ')                               // put multi-line selectors on single line
          .replace(/\s*{/g, '{')                               // remove space(s) before opening brace (added by prettier)
          .replace(/<(immutable|protected|public)\s>/g,'<$1>') // remove space after inferred type (added by prettier)
}

module.exports = { format }