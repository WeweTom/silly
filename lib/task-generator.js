// -*- coding: utf-8; -*-
module.exports = function(task,task_cfg,silly){
  return function(silly_cfg){
    return task.call(null,task_cfg,silly_cfg,silly)
  }
}

