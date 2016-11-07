#!/usr/bin/env node

/*
  usage:

  ```
  jpm xpi  # makes myaddon.xpi
  npm install addon-linter
  ./node_modules/.bin/addon-linter myaddon.xpi | node addon-lint-consumer.js
  ```

  license:  PUBLIC DOMAIN.

//example .addonlinterrc
ignorerules:
  LOW_LEVEL_MODULE: true
  KNOWN_LIBRARY: true

*/

let yamljs = require("yamljs");

function loadRules(fn) {
  let ignored = {};
  try {
    ignored = (yamljs.load(fn)).ignorerules;
  } catch (err) {
    // ignore
  }
  return ignored;
}

function filterLint(lint, ignored) {
  ["errors", "notices", "warnings"].map(k => { // eslint-disable-line array-callback-return
    let filtered = lint[k].filter(seen => !(seen.code in ignored));
    lint[k] = filtered;
  });
  return lint;
}

function output(filteredLint) {
  let show = 0;
  ["errors", "notices", "warnings"].map(k => { // eslint-disable-line array-callback-return
    if (filteredLint[k].length) {
      show = 1;
    }
  });
  if (show) {
    console.error(filteredLint); // eslint-disable-line no-console
  }
  process.exit(show); // eslint-disable-line no-process-exit
}

function doTheWork(content) {
  // your code here
  let ignored = loadRules(".addonlinterrc");
  output(filterLint(JSON.parse(content), ignored));
}

// read in all the stdin
let content = "";
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", buf => {
  content += buf.toString();
});
process.stdin.on("end", () => {
  // your code here
  doTheWork(content);
});
