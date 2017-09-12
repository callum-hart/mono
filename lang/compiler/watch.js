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