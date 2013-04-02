var Q = require('q')
  , fs = require('fs')
  , read = Q.nfbind(fs.readFile)
  , write = Q.nfbind(fs.writeFile)
  , mkdirp = require('mkdirp')
  , child_process = require('child_process')
  , exec = child_process.exec

exports.read = read
exports.write = write
exports.unlink = Q.nfbind(fs.unlink)
exports.stat = Q.nfbind(fs.stat)

exports.mkdirp = function(dir){
  var defer = Q.defer()
    , promise = defer.promise
  mkdirp(dir,function(err){
    if(err){
      defer.reject(err)
      return
    }
    defer.resolve()
  })
  return promise
}
exports.copy = function(from,to){
  var defer = Q.defer()
    , promise = defer.promise
    , rs
    , ws

  rs = fs.createReadStream(from)
  ws = fs.createWriteStream(to)
  rs.on('error',function(err){
    defer.reject(err)
  })
  ws.on('error',function(err){
    defer.reject(err)
  })
  ws.on('close',function(){
    defer.resolve()
  })
  rs.pipe(ws)
  return promise
}

exports.exec = function(cmd){
  var defer = Q.defer()
    , promise = defer.promise
  exec(cmd,function(err){
    if(err){
      defer.reject(err)
    }else{
      defer.resolve()
    }
  })
  return promise
}

exports.check = function(cmd){
  var defer = Q.defer()
    , promise = defer.promise
  exec(cmd,function(err,stdout,stderr){
    if(err){
      defer.reject(err)
    }else{
      defer.resolve()
    }
  })
  return promise
}