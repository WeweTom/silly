var Q = require('q')
  , fs = require('fs')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , queue = []
  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs,filename,extname){
    queue.push(commontask.unlink(abs))
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