var Q = require('q')
  , fs = require('fs')
  , read = Q.nfbind(fs.readFile)
  , write = Q.nfbind(fs.writeFile)
  , getdeps = require('../lib/parse-deps')
  , mkdirp = require('mkdirp')
  , child_process = require('child_process')
  , exec = child_process.exec
  , iconv = require('iconv-lite')

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
exports.getdeps = function (abspath){
  var defer = Q.defer()
    , promise = defer.promise
  getdeps(abspath,function(filepaths){
    defer.resolve(filepaths)
  })
  return promise
}
exports.charset = function(filename,from,to){
  var defer = Q.defer()
    , promise = defer.promise
    , buf
  from || (from = "utf-8");
  read(filename,from)
  .then(function(buf){
    var str = iconv.decode(buf,from)
      , b = iconv.encode(str,to)

    defer.resolve(b);
  })
  .fail(function(err){
    defer.reject(err)
  });
  return promise;
}
