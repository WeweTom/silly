
var tool = require('../lib/tool')
var fs = require('fs')

var buf = fs.readFileSync('case-match-files.js');
var c = tool.getCharsetFromBuffer(buf);

console.log(c);