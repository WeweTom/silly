// -*- coding: utf-8; -*-
var fs = require('fs')
  , Path = require('path')
  , Q = require('q')
  , TaskCommon = require('../tasks/task-async-common')
  , BASE_DIR = Path.dirname(Path.dirname(__filename))
  , Mustache = require('mustache')


function initKissyPie(dirname,cwd,force){
  var defer = Q.defer()
    , promise = defer.promise
  if(!force){
    initKissyPiePrepare(dirname,cwd)
    .then(function(hasfiles){
      if(hasfiles){
        defer.reject("当前文件不为空，要强制初始化，请加参数 -f")
      }else{
        init()
      }
    })
    .fail(function(err){
      defer.reject(err)
    })
  }else{
    init()
  }
  function init(){
    initKissyPieDir(dirname,cwd)
    .then(function(){
      initKissyPieFile(dirname,cwd)
      .then(function(){
        initKissyPieWrite(dirname,cwd)
        .then(function(){
          defer.resolve()
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
exports.initKissyPie = initKissyPie

function initKissyPiePrepare(dirname,cwd){
  var defer = Q.defer()
    , promise = defer.promise
    , dest = Path.resolve(cwd,dirname)
  TaskCommon.stat(dest)
  .then(function(stats){
    var dir = dest
    if(stats.isFile()){
      dir = Path.dirname(dir)
    }
    fs.readdir(dir,function(err,files){
      if(err){
        defer.reject(err)
      }else{
        var hasFiles = files.length > 0
        defer.resolve(hasFiles)
      }
    })

    defer.reject('当前目录不为空')
  })
  .fail(function(){
    defer.resolve(false)
  })
  return promise
}

function initKissyPieDir(dirname,cwd){
  var defer = Q.defer()
    , promise = defer.promise
  var pagemods = Path.resolve(cwd,dirname,'page/mods')
    , test = Path.resolve(cwd,dirname,'page/test')
  Q.all([TaskCommon.mkdirp(pagemods),TaskCommon.mkdirp(test)])
  .then(function(){
    // cp files
    defer.resolve()
  })
  .fail(function(err){
    defer.reject(err)
  })
  return promise
}
function initKissyPieFile(dirname,cwd){
  var queue = []
  cwd || (cwd = '')

  var files = ['./fb-build.bat','./fb-build.sh']

  files.forEach(function(v){
    var from = Path.resolve(BASE_DIR+'/template/kissypie',v)
      , to = Path.resolve(cwd,dirname,v)
    queue.push(TaskCommon.copy(from,to))
  })
  return Q.all(queue)
}
// 更新模板
function initKissyPieWrite(dirname,cwd){
  var files = ['./fb-build.bat','./fb-build.sh']
    , queue = []

  files.forEach(function(file){
    var dest = Path.resolve(cwd,dirname,file)
    queue.push(
      TaskCommon.read(dest)
      .then(function(buffer){
        var filecontent = buffer.toString()
        filecontent = Mustache.render(filecontent,{cli:"silly",appdir:dirname})

        TaskCommon.write(dest,filecontent)
        .then(function(){
          console.log('init template file:'+file)
        })
        .fail(function(){
          console.log('init template file:'+file)
        })
      })
    )
  })
  return Q.all(queue)
}
