const fs = require('fs');
const _ = require('lodash');


const log = require('./log').config;


const CONFIG_PATH = `${process.cwd()}/monoConfig.json`;
let config;


const init = (() => {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH));
  } catch(e) {
    log.CONFIG_ERROR(e);
  }
})();

const isValid = () => {
  return _.has(config, 'src') &&
         _.has(config, 'dest');
}

const getSrc = () => {}

const getDest = () => {}

module.exports = { isValid, getSrc, getDest };