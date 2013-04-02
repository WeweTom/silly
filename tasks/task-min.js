var jsp = require("uglify-js").parser
  , pro = require("uglify-js").uglify
  , Mustache = require('mustache')
  , _ = require('underscore')
  , Q = require('q')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , Path = require('path')
  , mkdirp = require('mkdirp')
  , sillyTool = require('../lib/tool')

// match file --> min file  --> write file
module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , mintasks = []

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs,filename,extname,$){
    var min_defer = Q.defer()
      , min_promise
    commontask.read(abs)
    .then(function(buffer){
      var filecontent = buffer.toString()
        , filename
        , data = _.extend({
          filename:filename,
          basename:Path.basename(abs,'.js'),
          extname:Path.extname(abs,'.js')
        },SILLY.var)

      filename = sillyTool.makemoney(cfg.dest,$)
      filename = Mustache.render(cfg.dest,data)

      try{
        filecontent = sillyTool.compress(filecontent)
      }catch(e){
        console.log('min>>>')
        console.log('压缩出错')
        console.log(e)
        min_defer.reject(e)
        return
      }
      filename = Path.resolve(SILLY.root,filename)
      var dirname = Path.dirname(filename)
      commontask.mkdirp(dirname)
      .then(function(){
        commontask.write(filename,filecontent)
        .then(function(){
          console.log('min>>>compress file "'+filename+'"')
          min_defer.resolve()
        })
        .fail(function(err){
          console.log(err)
          console.log('min>>>fail to write file "'+filename+'"')
          min_defer.reject(err)
        })
      })
      .fail(function(err){
        console.log('min>>>')
        console.log('创建下面的文件夹失败:')
        console.log(dirname)
        min_defer.reject(err)
      })
    })
    .fail(function(err){
      min_defer.reject(err)
    })
    mintasks.push(min_promise)
  })
  stream.on('end',function(){
    Q.all(mintasks)
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
