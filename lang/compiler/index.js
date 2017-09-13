#! /usr/bin/env node


const CLI = require('./cli');
const CONFIG = require('./config');


if (CLI.isValid()) {
  CLI.getArgs();
} else {
  // handle errors
}

if (CONFIG.isValid()) {
  CONFIG.getConfig();
} else {
  // handle errors
}

