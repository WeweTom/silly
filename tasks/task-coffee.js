// -*- coding: utf-8; -*-
var _ = require('underscore')
  , Path = require('path')
  , Q = require('q')
  , Mustache = require('mustache')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , mkdirp = require('mkdirp')
  , exec = commontask.exec

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , queue = []
  commontask.check('coffee -v')
  .then(function(){
    stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
    stream.on('file',function(abs,filename,extname){
      var to
        , coffeea
        , coffee
      coffeea = ['coffee','-c',abs]
      coffee = coffeea.join(' ')
      queue.push(exec(coffee))
    })
    stream.on('end',function(){
      Q.all(queue)
      .then(function(){
        console.log('coffee>>>')
        console.log('build all done')
        defer.resolve(SILLY)
      })
      .fail(function(err){
        defer.reject(err)
      })
    })
  })
  .fail(function(err){
    defer.reject('请先安装coffee命令\nnpm install coffee-script -g')
  })
  return promise
}
