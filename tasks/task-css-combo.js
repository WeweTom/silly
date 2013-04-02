var jsp = require("uglify-js").parser
  , pro = require("uglify-js").uglify
  , Mustache = require('mustache')
  , Q = require('q')
  , Path = require('path')
  , _ = require('underscore')
  , tool = require('../lib/parse-deps-tool')
  , sillyTool = require('../lib/tool')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , mkdirp = require('mkdirp')
  , cssmin = require('ycssmin').cssmin

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , combofiles = []
    , readtasks = []
    , stream
    , pkgroot = SILLY.pkgroot
    , pkgname = SILLY.pkgname
    , opts = {
      pkgpath:pkgroot,
      pkgname:pkgname
    }

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs){
    combofiles.push(abs)
  })
  stream.on('end',function(){
    onend()
  })
  stream.on('error',function(err){
    defer.reject(err)
  })

  function onend(){
    combofiles.forEach(function(filepath){
      readtasks.push(commontask.read(filepath))
    })

    Q.all(readtasks)
    .then(function(buffers){
      var allcontent = ''
        , data = _.extend({
        },SILLY.var)

      buffers.forEach(function(buffer,key){
        var filecontent = buffer.toString()
          , fullpath = combofiles[key]
        allcontent = allcontent+"\n"+filecontent
      })
      console.info('css combo>>>')
      console.info(combofiles.join('\n'))

      if(typeof cfg.min_code == "undefined" || cfg.min_code){
        allcontent = cssmin(allcontent)
      }
      
      var filename = Mustache.render(cfg.dest,data)

      filename = Path.resolve(SILLY.root,filename)
      commontask.mkdirp(Path.dirname(filename))
      .then(function(){
        commontask.write(filename,allcontent)
        .then(function(){
          defer.resolve(SILLY)
        })
        .fail(function(err){
          defer.reject(err)
        })
      })
      .fail(function(err){
        defer.reject(err)
      })
    })
    .fail(function(err){
      defer.reject(err)
    })
  }
  return promise
}
