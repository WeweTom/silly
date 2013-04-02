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
    , queue = []
    , files = []
    , $$ = []
  commontask.check('lessc -v')
  .then(function(){
    stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
    stream.on('file',function(abs,filename,extname,$){
      files.push(abs)
      $$.push($)
    })
    stream.on('end',function(){
      if(files.length === 0){
        console.log('less>>>')
        console.log('未找到任何匹配的文件')
        defer.resolve(SILLY)
        return
      }
      var queueexe = []

      files.forEach(function(abs,key){
        var to
          , lessca
          , lessc
          , data = _.extend({
            filename:filename,
            basename:Path.basename(abs,'.less'),
            extname:Path.extname(abs)
          },SILLY.var)
          , filename
          , $ = $$[key]

        console.log($)

        filename = sillyTool.makemoney(cfg.dest,$)
        filename = Mustache.render(cfg.dest,data)
        to = Path.resolve(SILLY.root,filename)
        queue.push(commontask.mkdirp(Path.dirname(to)))
        lessca = ['lessc',abs,to,"--yui-compress"]
        lessc = lessca.join(' ')
        queueexe.push(exec(lessc))
      })

      Q.all(Q.all(queueexe),Q.all(queue))
      .then(function(){
        console.log('lessc>>>')
        console.log('build all done')
        defer.resolve(SILLY)
      })
      .fail(function(err){
        console.log('lessc>>>')
        console.log(err)
        defer.reject(err)
      })
      .fin(function(){

      })
    })
  })
  .fail(function(){
    defer.reject('请先安装lessc命令\nnpm install less -g')
  })
  return promise
}
