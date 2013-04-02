// -*- coding: utf-8; -*-
module.exports = function(task,cfg){
  return function(SILLY){
    return task.call(null,cfg,SILLY)
  }
}

