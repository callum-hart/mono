const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');


const Log = require('./log').config;


const CONFIG_FILE_NAME = 'monoConfig.json';
const CONFIG_PATH = `${process.cwd()}/${CONFIG_FILE_NAME}`;
const CONFIG_SAMPLE_PATH = './monoConfig.sample.json';
let config;


// todo: prevent init if cli cmd is `init`

// const init = (() => {
//   try {
//     config = JSON.parse(fs.readFileSync(CONFIG_PATH));
//   } catch(e) {
//     Log.CONFIG_ERROR(e);
//   }
// })();

const isValid = () => {
  // todo: add proper error handling, i.e missing src or missing dest
  return _.has(config, 'src') &&
         _.has(config, 'dest');
}

const bootstrap = () => {
  ifConfigExists()
    .then(() => {
      shouldReplaceExistingConfig()
        .then(() => {
          generateConfig()
        }, () => {
          process.exit();
        });
    }, () => {
      generateConfig();
    }).catch (() => {
      console.log(`ifConfigExists promise caught`);
    });
}

const ifConfigExists = () => {
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

/*
  When node v.8.5 is stable replace with `copyFileSync`
*/
const generateConfig = () => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(require(CONFIG_SAMPLE_PATH), null, 2));
    Log.CONFIG_SAMPLE_CREATED(CONFIG_FILE_NAME, CONFIG_PATH);
  } catch(e) {
    Log.CONFIG_SAMPLE_FAILED(CONFIG_FILE_NAME, e);
  }
}

const shouldReplaceExistingConfig = () => {
  const YES = 'y';
  const NO = 'n';
  const ask = `A ${CONFIG_FILE_NAME} file already exists in this project. \n => Located: ${CONFIG_PATH} \nWould you like to replace it? (${YES}/${NO}): `;

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(ask, (answer) => {
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

const getSrc = () => {}

const getDest = () => {}

module.exports = {
  isValid,
  bootstrap,
  getSrc,
  getDest
};