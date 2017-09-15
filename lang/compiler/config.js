const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');


const Log = require('./log').config;


const CONFIG_FILE_NAME = 'monoConfig.json';
const CONFIG_PATH = `${process.cwd()}/${CONFIG_FILE_NAME}`;
const CONFIG_SAMPLE = require('./monoConfig.sample.json');
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
          console.log(`Don't replace existing ${CONFIG_FILE_NAME}`);
        });
    }, () => {
      generateConfig();
    }).catch (() => {

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
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG_SAMPLE));
    console.log(`monoConfig.json created in: ${CONFIG_PATH}`);
  } catch(e) {
    console.log('Error generating config ', e);
  }
}

const shouldReplaceExistingConfig = () => {
  const YES = 'y';
  const NO = 'n';
  const message = `Replace existing ${CONFIG_FILE_NAME} file (${YES}/${NO}): `;

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(message, (answer) => {
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