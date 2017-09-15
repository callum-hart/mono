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
    CONFIG_ERROR: (e) => {
      console.log(`Config error: ${e}`);
    }
  }
};