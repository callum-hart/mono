/**
 * Todos
 * - decide whether logs should show in tests
 * - make logs pretty with chalk
 * - add spinners / progress bars to slow logs
 * - add emojis (make this a config option - enabled / disabled)
 * - add more generic methods (like codeError) i.e: title();
 */

const chalk = require('chalk');

/**
 * Generic log for code errors.
 *
 * Normalise participants as much as possible for easier comparison.
 * - remove whitespace(s)
 * - make lowercase
 * - make all quotes double
 *
 * @param  {File<name, soruce>} file  - file containing problem code
 * @param  {String} code              - loc containing the error (formatted)
 * @param  {String} offender          - offending part of `code`
 * @return {Object}                   - error data with the shape { lineNumber, codeBlock }
 *
 * Todo: needs revisiting - see `log.test.js:56` - might need to use source-maps to
 * map source with formatted source?
 */
const codeError = (file, code, offender) => {
  const needle = code
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/'/g, '"');

  const fragment = offender
                    .toLowerCase()
                    .replace(/'/g, '"');

  // Todo: remove single-line comments & remove multi-line comments (whilst preserving lines)
  const haystack = file.source.split(/\n/);
  let lineNumber;
  const exactMatchIfAny = findExactMatch(haystack, needle, fragment);

  console.log(`code: ${code}`);
  console.log(`offender: ${offender}`);

  if (exactMatchIfAny) {
    lineNumber = exactMatchIfAny;
  } else {
    const partialMatchIfAny = findPartialMatch(haystack, needle, fragment);

    if (partialMatchIfAny) {
      lineNumber = partialMatchIfAny;
    }
  }

  const codeBlock = ` ${lineNumber} | ${haystack[lineNumber - 1]}`;

  console.log(` - ${file.name} \n`);
  console.log(chalk.grey(codeBlock));
  addCarets(codeBlock, fragment);

  return {
    lineNumber,
    codeBlock
  }
}

const findExactMatch = (haystack, needle, fragment) => {
  const lineIndex = haystack.findIndex((source, index) => {
    const loc = source
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/'/g, '"');

    if (loc.includes(fragment) && loc === needle) {
      return true;
    }
  });

  return lineIndex + 1;
}

const findPartialMatch = (haystack, needle, fragment) => {
  const lineIndex = haystack.findIndex((source, index) => {
    const loc = source
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/'/g, '"');

    if (loc.includes(fragment)) {
      // partial match (loc is a subset of needle)
      if (needle.includes(loc)) {
        return true;
      }

      // partial match (needle is a subset of loc)
      if (loc.includes(needle)) {
        return true;
      }
    }
  });

  return lineIndex + 1;
}

/**
 * Add carets underneath error.
 *
 * @param  {String} codeBlock - loc containing the error (including line number)
 * @param  {String} fragment  - offending part of `codeBlock`
 */
const addCarets = (codeBlock, fragment) => {
  const start = codeBlock
                      .toLowerCase()
                      .replace(/'/g, '"')
                      .indexOf(fragment);
  const end = start + fragment.length;
  const padding = ' '.repeat(start);
  const carets = '^'.repeat(end-start);

  console.log(chalk.red(`${padding}${carets}\n`));
}

module.exports = {
  codeError, // export for testing purposes
  cli: {
    NO_ARGUMENT: () => {
      console.log('[Cli] No argument(s) present');
    },
    UNRECOGNIZED_ARGUMENT: arg => {
      console.log(`[Cli] Unrecognized argument: ${arg}`);
    }
  },
  config: {
    CONFIG_ERROR: err => {
      console.log(`[Config] Error with config \n └─ ${err}`);
    },
    CONFIG_VALIDATION_ERRORS: (fileName, errors) => {
      console.log(`[Config] Validation of ${fileName} failed`);
      errors.forEach((err) => console.log(` └─ ${err}`));
    },
    CONFIG_SAMPLE_CREATED: (fileName, location) => {
      console.log(`[Config] Added ${fileName} to project \n └─ Located: ${location}`);
    },
    CONFIG_SAMPLE_FAILED: (fileName, err) => {
      console.log(`[Config] Failed to create ${fileName} \n └─ ${err}`);
    },
    SHOULD_REPLACE_CONFIG: (configFileName, configFilePath, yes, no) => {
      return `A config file (${configFileName}) already exists in this project. \n └─ Located: ${configFilePath} \nWould you like to replace it? (${yes}/${no}): `;
    }
  },
  formatter: {
    INVALID_CSS: (fileName, monoSource, prettierErr) => {
      // Line number reported by prettier is after formatting, here we find the
      // actual line number of the error in the mono source.

      // const offendingCode = prettierErr.loc.start.source.split(/\n/)[prettierErr.loc.start.line - 1]; // minus 1 since first line has position 0 in array
      // const actualLineNumber = monoSource.split(/\n/).indexOf(offendingCode) + 1; // plus 1 since index begins at 0, whereas line number begins at 1

      // console.log(`\n${chalk.grey(`[Format] Invalid CSS detected in: ${fileName} (line: ${actualLineNumber})`)}`);
      // console.log(`└─ ${prettierErr.name}: ${prettierErr.loc.start.reason}`);
      // console.log(`\n${chalk.red(offendingCode)}\n`);


      // ☝️ NOT WORKING - see `withCSSErrors.mono`. For now just log prettier error:

      console.log(`[Format] Invalid CSS detected in: ${fileName} \n └─ ${prettierErr.name}: ${prettierErr.loc.start.reason}`);
      console.log(prettierErr.codeFrame);
    }
  },
  lexer: {
    UNKNOWN_TYPE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Type error] Unknown type`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid type`));
      console.log(`\nTip: expected one of the following: \n - immutable\n - protected\n - public\n`);
    },
    UNKNOWN_MODIFIER: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Modifier error] Unknown modifier`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid modifier`));
      console.log(`\nTip: expected one of the following: \n - @override\n - @mutate\n`);
    },
    UNKNOWN_MOTIVE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Motive error] Unknown motive used`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid motive`));
      console.log(`\nTip: expected one of the following: \n - ?overrule\n - ?overthrow\n - ?veto\n - ?fallback\n - ?because\n - ?patch\n`);
    },
    MOTIVE_WITHOUT_REASON: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Motive error] Missing reason`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is missing a reason`));
      console.log(`\nThe motive '${fragment}' requires a parameter explaining usage, for example:`);
      console.log(chalk`\n {grey width<${fragment}(}{green 'a reason for usage'}{grey )>: 100%;}\n`);
    },
    CANNOT_INFER_MODIFIER: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Modifier error] Inferred modifier found`));
      codeError(file, code, fragment);
      console.log(chalk`{red Rule-set cannot infer a modifier (${fragment.toLowerCase()})}`);
      console.log(chalk`\nTip: rule-sets can only infer a {bold type}, for example: \n - {grey a.link<{green immutable}> {}\n - {grey a.link<{green protected}> {}\n - {grey a.link<{green public}> {}\n`);
    },
    CANNOT_INFER_MOTIVE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Motive error] Inferred motive found`));
      codeError(file, code, fragment);
      console.log(chalk`{red Rule-set cannot infer a motive (${fragment.toLowerCase()})}`);
      console.log(chalk`\nTip: rule-sets can only infer a {bold type}, for example: \n - {grey a.link<{green immutable}> {}\n - {grey a.link<{green protected}> {}\n - {grey a.link<{green public}> {}\n`);
    },
    TYPE_ALREADY_DECLARED: (file, code, fragment) => {
      // todo: improve description
      console.log(chalk.blue(`\n[Type error] Multiple types found`));
      codeError(file, code, fragment);
    },
    MODIFIER_ALREADY_DECLARED: (file, code, fragment) => {
      // todo: improve description
      console.log(chalk.blue(`\n[Modifier error] Multiple modifiers found`));
      codeError(file, code, fragment);
    },
    MISSING_NOTION: (file, code, fragment) => {
      // todo: improve description
      console.log(chalk.blue(`\n[Notion error] Missing notion`));
      codeError(file, code, fragment);
      console.log(chalk.red(`Expected notion between comma and >\n`));
    },
    MISSING_ELEMENT_TYPE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Selector error] Missing HTML element type`));
      codeError(file, code, fragment);
      console.log(chalk`{red {bold ${fragment}} is missing a HTML element type}\n`);
      console.log(chalk`Tip: expected selector to include element type, for example: \n - {green div}{grey ${fragment}} \n - {green p}{grey ${fragment}} \n - {green section}{grey ${fragment}}\n`);
      console.log(chalk`Futher reading:\n {grey - See https://developer.mozilla.org/en-US/docs/Web/HTML/Element for a comprehensive list of available HTML elements}\n`);
    },
    INVALID_ELEMENT_TYPE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Selector error] Invalid HTML element type`));
      codeError(file, code, fragment);
      console.log(chalk`{red {bold ${fragment}} isn't a valid HTML element type}\n`);
      console.log(chalk`Futher reading:\n {grey - See https://developer.mozilla.org/en-US/docs/Web/HTML/Element for a comprehensive list of valid HTML elements}\n`);
    },
    DECLARATION_USES_IMPORTANT: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Declaration error] Cannot use !important`));
      codeError(file, code, fragment);
      console.log(chalk`Tip: usage of {bold !important} suggests an uncontrolled override has been attempted. The only way to override a property is using a modifier.\n`);
      console.log(chalk`Futher reading:\n {grey - See https://callum-hart.gitbooks.io/mono/docs/language/Modifiers.html for more information}\n`);
    }
  },
  parser: {
    PARSER_ERROR: err => {
      console.log(`[Parser] Error with mono source file \n └─ ${err} `);
    },
    CANNOT_INFER_TYPE: (file, code, fragment) => {
      console.log(chalk.blue(`\n[Type error] Cannot infer type`));
      codeError(file, code, fragment);
      console.log(chalk`{red Type cannot be inferred by grouped selector}\n`);
    }
  }
};