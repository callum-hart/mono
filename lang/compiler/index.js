#! /usr/bin/env node


const CLI = require('./cli');
const CONFIG = require('./config');

if (CLI.isValid()) {
  CLI.processArgs();
} else {
  // handle errors
}

CONFIG.isValid();