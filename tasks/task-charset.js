var Q = require('q')
  , fs = require('fs')
  , Path = require('path')
  , Mustache = require('mustache')
  , mkdirp = require('mkdirp')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , _ = require('underscore')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , queue = []
    , dests = []

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)

  stream.on('file',function(abs,filename,extname){
    var dest = Path.resolve(SILLY.root,cfg.dest)
      , data = _.extend({
        filename:filename,
        basename:Path.basename(abs,'.js'),
        extname:Path.extname(abs,'.js')
      },{self:SILLY.config})
    dest = Mustache.render(dest,data);
    dests.push(dest);
    var tobuf = commontask.charset(abs,cfg.from_charset,cfg.to_charset)

  var defer = Q.defer()
    , promise = defer.promise

    tobuf
    .then(function(buf){
      commontask
      .write(dest,buf)
      .then(function(){
        defer.resolve();
      })
      .fail(function(err){
        defer.reject(err);
      });
    })
    .fail(function(err){
      defer.reject(err);
    })
    queue.push(promise);
  })
  stream.on('end',function(){
    Q.all(queue)
    .then(function(buf){

      defer.resolve(SILLY)
    })
    .fail(function(err){
      defer.reject(err)
    })
  })
  return promise
}

