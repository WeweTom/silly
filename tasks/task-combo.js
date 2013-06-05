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
        , comboContent
        , comboFilename
        , data = _.extend({
        },{self:SILLY.config})

      buffers.forEach(function(buffer,key){
        var filecontent = buffer.toString()
          , fullpath = combofiles[key]
        // filecontent = tool.fixmodname(filecontent,fullpath,opts)
        // filecontent = tool.fixrequirename(fullpath,pkgroot,pkgname,filecontent)
        allcontent = allcontent+";"+filecontent
      })

      console.info('combo files>>>')
      console.info(combofiles.join('\n'))

      var filename = Mustache.render(cfg.dest,data)
      if(cfg.min_code != false){
        if(cfg.combo_file){
          comboContent = allcontent;
          comboFilename = sillyTool.min2combo(filename);
        }
        allcontent = sillyTool.compress(allcontent)
      }

      filename = Path.resolve(SILLY.root,filename)
      commontask.mkdirp(Path.dirname(filename))
      .then(function(){
        var twoTask = [commontask.write(filename,allcontent)]
        if(comboContent){
          twoTask.push(commontask.write(comboFilename,comboContent));
        }
        Q.all(twoTask)
        .then(function(){
          defer.resolve(SILLY)
        })
        .fail(function(err){
          defer.reject(err)
        })
        //commontask.write();
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
