// -*- coding: utf-8; -*-
var fs = require('fs')
  , tool = require('../lib/tool')
  , _ = require('underscore')
  , Q = require('q')
  , matchfiles = require('matchfiles')

module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , jsonconfig = SILLY.config
    , config = jsonconfig.config
    , tasks = cfg.tasks

  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs,filename,extname){
    fs.watch(abs
            ,tool.throttle(function(){
               console.log('watch task>>>',filename,'changed')
               var errorstack = []
                tasks &&
                 tasks.forEach(function(taskname){
                   var taskconfig = config[taskname]
                     , task = SILLY.Tasks[taskname]
                   task = task && require(task)
                   if(!task){
                     try{
                       task = require(taskname)
                     }catch(e){
                       console.log(e)
                       errorstack.push('未发现第三方插件:'+taskname)
                       errorstack.push('请尝试:')
                       errorstack.push('npm instasll '+taskname)
                     }
                   }

                   if(!task){
                     return
                   }

                   _.chain(taskconfig)
                   .pairs(taskconfig)
                   .map(function(value,key){
                     var config = value[1]
                       , t = {
                         taskname:key
                       , taskconfig:config
                       }

                     task(config,SILLY)
                     .then(function(){

                     })
                     .fail(function(){

                     })
                   })
                 })
             },200))
  })

  stream.on('end',function(){
    defer.resolve(SILLY)
  })

  stream.on('error',function(err){
    defer.reject(err)
  })
  return promise
}