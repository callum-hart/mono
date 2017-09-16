module.exports = {
  cli: {
    NO_ARGUMENT: () => {
      console.log('No argument(s) present');
      process.exit();
    },
    UNRECOGNIZED_ARGUMENT: (arg) => {
      console.log(`Unrecognized argument: ${arg}`);
      process.exit();
    }
  },
  config: {
    CONFIG_ERROR: (err) => {
      console.log(`Config error: ${err}`);
    },
    CONFIG_SAMPLE_CREATED: (fileName, location) => {
      console.log(`Successfully created ${fileName} \n => Located: ${location}`);
      process.exit();
    },
    CONFIG_SAMPLE_FAILED: (fileName, err) => {
      console.log(`Failed to create ${fileName} \n => ${err}`);
      process.exit();
    }
  }
};