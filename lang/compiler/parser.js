const fs = require('fs');
const _ = require('lodash');


const Log = require('./log').parser;
const Config = require('./config');
const EXTENSION = '.mono';
let ast = {
  source: [],
}

const run = () => {
  try {
    Config.getSrc().forEach((file, order) => {
      const fileName = _.endsWith(file, EXTENSION) ? file : `${file}${EXTENSION}`;
      const monoSource = fs.readFileSync(`${process.cwd()}/${fileName}`).toString();

      ast.source.push({
        fileName,
        order,
        monoSource
      });
    });

    parse();
  } catch (e) {
    Log.SOURCE_ERROR(e);
  }
}

const parse = () => {
  console.log(ast.source);
}

module.exports = {
  run
};