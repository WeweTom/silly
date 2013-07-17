// -*- coding: utf-8-unix; -*-
var Path = require('path')
  , DIR_NAME = Path.dirname(__filename)
function resolve(p){
  return Path.resolve(DIR_NAME,p)
}

module.exports = {
  "min":resolve("../tasks/task-min"),
  "combo":resolve("../tasks/task-combo"),
  "ksmin":resolve("../tasks/task-kiss-min"),
  "css-combo":resolve("../tasks/task-css-combo"),
  "less":resolve("../tasks/task-less"),
  "compass":resolve("../tasks/task-compass"),
  "coffee":resolve("../tasks/task-coffee"),
  "html2tpl":resolve("../tasks/task-html2tpl"),
  "watch":resolve("../tasks/task-watch"),
  "rm":resolve("../tasks/task-rm"),
  "cp":resolve("../tasks/task-cp"),
  "charset":resolve("../tasks/task-charset")
}