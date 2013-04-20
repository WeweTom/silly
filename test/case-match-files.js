// -*- coding: utf-8; -*-
// 中文注释

var matchfiles = require('matchfiles')

var stream = matchfiles('/home/tom/Dropbox/gits/silly_builder2/test/silly_prject/one',['a.js','b.js'])

stream.on('file',function(abs,filename){
  console.log(filename)
})

