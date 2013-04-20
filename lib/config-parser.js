// -*- coding: utf-8; -*-
var _ = require('underscore')
  , path = require('path')
  , util = require('util')
  , fs = require('fs')
  , Emitter = require('events').EventEmitter


//从json中解析出task配置
function parseJSONObject(cfg){
  this.cfg = cfg
}
util.inherits(parseJSONObject,Emitter)

parseJSONObject.prototype.parse = function(json){
  json || (json = this.cfg)
  if(!json){
    throw Error('缺少配置')
  }

  var tasks = json.tasks
    , that = this
    , taskconfig = []
  _.chain(tasks)
  .pairs(tasks)
  .map(function(pair,index){
    var taskname = pair[0]
      , taskqueue
    if(toString.call(pair[1]) != "[object Array]"){
      taskqueue = [pair[1]];
    }else{
      taskqueue = pair[1];
    }

    taskqueue.forEach(function(task){
      var t = {
          taskname:taskname
        , taskconfig:task
        , context:json
        }

     taskconfig.push(t)
     that.emit('task',t)
    })
  })
  that.emit('end',{
    taskconfig:taskconfig
  })
}

module.exports = parseJSONObject