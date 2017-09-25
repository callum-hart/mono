module.exports = {
  cli: {
    NO_ARGUMENT: () => {
      console.log('[Cli] No argument(s) present');
      process.exit();
    },
    UNRECOGNIZED_ARGUMENT: arg => {
      console.log(`[Cli] Unrecognized argument: ${arg}`);
      process.exit();
    }
  },
  config: {
    CONFIG_ERROR: err => {
      console.log(`[Config] Error with config \n └─ ${err}`);
      process.exit();
    },
    CONFIG_VALIDATION_ERRORS: (fileName, errors) => {
      console.log(`[Config] Validation of ${fileName} failed`);
      errors.forEach((err) => console.log(` └─ ${err}`));
      process.exit();
    },
    CONFIG_SAMPLE_CREATED: (fileName, location) => {
      console.log(`[Config] Added ${fileName} to project \n └─ Located: ${location}`);
      process.exit();
    },
    CONFIG_SAMPLE_FAILED: (fileName, err) => {
      console.log(`[Config] Failed to create ${fileName} \n └─ ${err}`);
      process.exit();
    },
    SHOULD_REPLACE_CONFIG: (configFileName, configFilePath, yes, no) => {
      return `A config file (${configFileName}) already exists in this project. \n └─ Located: ${configFilePath} \nWould you like to replace it? (${yes}/${no}): `;
    }
  },
  parser: {
    SOURCE_ERROR: err => {
      console.log(`[Parser] Error with mono source file \n └─ ${err} `);
      process.exit();
    }
  },
  formatter: {
    INVALID_CSS: (fileName, err) => {
      // console.log(`[Format] Invalid CSS detected in: ${fileName} \n └─ ${err.name}: ${err.loc.start.reason} \n `);
      // console.log(err.codeFrame);
      console.log(err);
      process.exit();
    }
  }
};