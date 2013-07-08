var Q = require('q')
  , fs = require('fs')
  , Path = require('path')
  , Mustache = require('mustache')
  , mkdirp = require('mkdirp')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , queue = []

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)

  stream.on('file',function(abs,filename,extname){
    var to = Path.resolve(SILLY.root,cfg.dest);
    to = Path.join(to,filename);
    queue.push(commontask.copy(abs,to));
  })
  stream.on('end',function(){
    Q.all(queue)
    .then(function(){
      defer.resolve(SILLY)
    })
    .fail(function(err){
      defer.reject(err)
    })
  })
  return promise
}