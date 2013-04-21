var Mustache = require('mustache')
  , _ = require('underscore')
  , Q = require('q')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , Path = require('path')
  , mkdirp = require('mkdirp')
  , sillyTool = require('../lib/tool')
  , html2tpl = require('../lib/html2tpl')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , queue = []

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs,filename,extname){
    var defer = Q.defer()
      , promise = defer.promise

    var task
      , data = _.extend({
        filename:filename,
        basename:Path.basename(abs,'.js'),
        extname:Path.extname(abs,'.js')
      },{self:SILLY.config})
    commontask.read(filename)
    .then(function(buffer){
      var filecontent = buffer.toString()
        , tpl
        , to = Mustache.render(cfg.dest,data)
      tpl = html2tpl(filecontent)
      commontask.write(to,tpl)
      .then(function(){
        console.log('html2tpl>>>')
        console.log(filename)
        console.log('[success]')
        defer.resolve()
      })
      .fail(function(err){
        defer.reject(err)
      })
    })
    .fail(function(err){
      defer.reject(err)
    })
    queue.push(promise)
  })
  stream.on('end',function(){
    console.log(queue)
    Q.all(queue)
    .then(function(){
      defer.resolve(SILLY)
    })
    .fail(function(err){
      defer.reject(err)
    })
  })
  stream.on('error',function(err){
    defer.reject(err)
  })

  return promise
}
