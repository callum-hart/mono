#! /usr/bin/env node

// CLI args:

const userArgs = process.argv.slice(2);
console.log(userArgs);


/*
  2 ways to compile mono:

  1. make: run `mono make` to build project from scratch
  2. watch: run `mono watch` to compile project when files changes
*/


/*
  Watch files.

  For initial implementation `watch` can just call `make`.
  Caching & perf optimisations can come later.
*/

const chokidar = require('chokidar');


const watcher = chokidar.watch('../sample', {});

const fileAdded = (file) => {
  console.log(`fileAdded: ${file}`);
}

const fileChanged = (file) => {
  console.log(`fileChanged: ${file}`);
}

const fileRemoved = (file) => {
  console.log(`fileRemoved: ${file}`);
}

watcher
  .on('add', path => fileAdded(path))
  .on('change', path => fileChanged(path))
  .on('unlink', path => fileRemoved(path));
