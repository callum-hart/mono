/**
 * Todos
 * - decide whether logs should show in tests
 * - make logs pretty with chalk
 * - adding spinners / progress bars to slow logs
 */

const chalk = require('chalk');


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

      // todo: find actual column in mono source; for an even nicer error message.

      const offendingCode = prettierErr.loc.start.source.split(/\n/)[prettierErr.loc.start.line - 1]; // minus 1 since first line has position 0 in array
      const actualLineNumber = monoSource.split(/\n/).indexOf(offendingCode) + 1; // plus 1 since index begins at 0, whereas line number begins at 1

      console.log(`\n${chalk.grey(`[Format] Invalid CSS detected in: ${fileName} (line: ${actualLineNumber})`)}`);
      console.log(`└─ ${prettierErr.name}: ${prettierErr.loc.start.reason}`);
      console.log(`\n${chalk.red(offendingCode)}\n`);
    }
  }
};