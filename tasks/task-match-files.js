var Q = require('Q')
  , matchfiles = require('matchfiles')

module.exports = function(CONFIG){
  var cfg = CONFIG.__TASK_MATCH_FILES__
    , root = CONFIG.root
    , include = CONFIG.include
    , exclude = CONFIG.exclude

  var defer = Q.defer()
    , promise = defer.promise
    , stream = matchfiles(root,include,exclude)
    , result = []

  stream.on('file',function(abs,filename){
    result.push(abs)
  })
  stream.on('end',function(){
    cfg.result = result
    defer.resolve(CONFIG)
  })
  stream.on('error',function(err){
    defer.reject(err)
  })
  return promise
}
