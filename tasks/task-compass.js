// -*- coding: utf-8; -*-
var _ = require('underscore')
  , Path = require('path')
  , Q = require('q')
  , Mustache = require('mustache')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , mkdirp = require('mkdirp')
  , exec = commontask.exec
  , sillyTool = require('../lib/tool')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , files = []

  commontask.check('compass -v')
  .then(function(){
    var src
      , queue = []
    if(!sillyTool.isArray(cfg.src)){
      src = [cfg.src]
    }else{
      src = cfg.src
    }
    src.forEach(function(dir){
      queue.push(exec(['compass','compile',dir].join(' ')))
    })
    Q.all(queue)
    .then(function(){
      console.log('sass>>>')
      console.log('build all done')
      defer.resolve(SILLY)
    })
    .fail(function(err){
      console.log('compass>>>')
      console.log(err)
      defer.reject(err)
    })
  })
  .fail(function(){
    defer.reject('请先安装compass')
  })
  return promise
}
