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
 *
 * @param  {File<name, soruce>} file  - file containing problem code
 * @param  {String} code              - loc containing the error (formatted)
 * @param  {String} fragment          - offending part of `code`
 */
const codeError = (file, code, fragment) => {
  const needle = code
                    .replace(/\s+/g, '')
                    .toLowerCase();

  const haystack = file.source.split(/\n/);

  const lineIndex = haystack.findIndex((source, index) => {
    const loc = source
                  .replace(/\s+/g, '')
                  .toLowerCase();

    if (loc.includes(fragment.toLowerCase())) {
      // exact match
      if (loc === needle) {
        return true;
      }

      // partial match (loc is a subset of needle)
      if (needle.includes(loc)) {
        return true;
      }
    }
  });

  const codeBlock = ` ${lineIndex + 1} | ${haystack[lineIndex]}`;

  console.log(` - ${file.name} \n`);
  console.log(chalk.grey(codeBlock));
  addCarets(codeBlock, fragment);
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
                      .indexOf(fragment.toLowerCase());
  const end = start + fragment.length;
  const padding = ' '.repeat(start);
  const carets = '^'.repeat(end-start);

  console.log(chalk.red(`${padding}${carets}\n`));
}

module.exports = {
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
  parser: {
    PARSER_ERROR: err => {
      console.log(`[Parser] Error with mono source file \n └─ ${err} `);
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
    INVALID_TYPE: (file, code, fragment) => {
      console.log(chalk.blue(`[Type error] Unknown type`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid type`));
      console.log(`\nTip: expected one of the following: \n - immutable\n - protected\n - public\n`);
    },
    INVALID_MODIFIER: (file, code, fragment) => {
      console.log(chalk.blue(`[Modifier error] Unknown modifier`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid modifier`));
      console.log(`\nTip: expected one of the following: \n - @override\n - @mutate\n`);
    },
    INVALID_MOTIVE: (file, code, fragment) => {
      console.log(chalk.blue(`[Motive error] Unknown motive used`));
      codeError(file, code, fragment);
      console.log(chalk.red(`'${fragment}' is not a valid motive`));
      console.log(`\nTip: expected one of the following: \n - ?overrule\n - ?overthrow\n - ?veto\n - ?fallback\n - ?because\n - ?patch\n`);
    }
  }
};