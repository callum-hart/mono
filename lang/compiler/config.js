const fs = require('fs');
const readline = require('readline');
const _ = require('lodash'); // todo: remove lodash dependency


const Log = require('./log').config;


const CONFIG_FILE_NAME = 'monoConfig.json';
const CONFIG_PATH = `${process.cwd()}/${CONFIG_FILE_NAME}`;
const CONFIG_SAMPLE_PATH = './monoConfig.sample.json';
let config;


const initialize = () => {
  return new Promise((resolve, reject) => {
      try {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH));

        if (configValid()) {
          resolve();
        } else {
          reject();
        }
      } catch(e) {
        Log.CONFIG_ERROR(e);
        reject();
      }
  });
}

const configValid = () => {
  const MISSING_SRC = 'Missing property `src`';
  const MISSING_DEST = 'Missing property `dest`';

  let errors = [
    MISSING_SRC,
    MISSING_DEST
  ];

  if (_.has(config, 'src')) {
    errors = errors.filter(err => err !== MISSING_SRC);
  }

  if (_.has(config, 'dest')) {
    errors = errors.filter(err => err !== MISSING_DEST);
  }

  if (!_.isEmpty(errors)) {
    Log.CONFIG_VALIDATION_ERRORS(CONFIG_FILE_NAME, errors);
  }

  return _.isEmpty(errors);
}

const bootstrap = () => {
  ifConfigAlreadyExists()
    .then(() => {
      shouldReplaceConfig()
        .then(() => {
          generateConfig()
        }, () => {
          process.exit();
        }).catch(() => console.log(`shouldReplaceConfig promise caught`));
    }, () => {
      generateConfig();
    }).catch (() => console.log(`ifConfigAlreadyExists promise caught`));
}

const ifConfigAlreadyExists = () => {
  return new Promise((resolve, reject) => {
    fs.access(CONFIG_PATH, fs.constants.R_OK, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const generateConfig = () => {
  try {
    // When node v.8.5 is stable can use `copyFileSync`
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(require(CONFIG_SAMPLE_PATH), null, 2));
    Log.CONFIG_SAMPLE_CREATED(CONFIG_FILE_NAME, CONFIG_PATH);
  } catch(e) {
    Log.CONFIG_SAMPLE_FAILED(CONFIG_FILE_NAME, e);
  }
}

const shouldReplaceConfig = () => {
  const YES = 'y';
  const NO = 'n';

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(Log.SHOULD_REPLACE_CONFIG(CONFIG_FILE_NAME, CONFIG_PATH, YES, NO), (answer) => {
      switch (answer) {
        case YES:
          return resolve();
        case NO:
          return reject();
        default:
          return reject();
      }

      rl.close();
    });
  });
}

const getSrc = () => {
  return config.src;
}

const getDest = () => {
  return config.dest;
}

module.exports = {
  initialize,
  bootstrap,
  getSrc,
  getDest
};