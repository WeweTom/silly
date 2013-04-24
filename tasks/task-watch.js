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
               var errorstack = []
                tasks &&
                 tasks.forEach(function(taskname){
                   var task = require(SILLY.Tasks[taskname])
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
                   cfg.tasks.forEach(function(taskname){
                     if(SILLY.Tasks[taskname]){
                       var taskconfigs = SILLY.config.tasks[taskname]
                       task = require(SILLY.Tasks[taskname]);
                       if(!task){
                         try{
                           task = require(taskname)
                         }catch(e){
                         }
                       }

                       if(toString.call(taskconfigs != "[object Array]")){
                         taskconfigs = [taskconfigs]
                       }

                       if(task){
                         taskconfigs.forEach(function(taskconfig){
                           task(taskconfig,SILLY)
                           .then(function(){
                             console.log('[success]');
                           })
                           .fail(function(){
                             console.log('[error]');
                           });
                         });
                       }else{
                         return;
                       }
                     }
                   });
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