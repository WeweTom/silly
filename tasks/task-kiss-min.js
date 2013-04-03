// -*- coding: utf-8-unix; -*-
var uglify = require("uglify-js")
  , Mustache = require('mustache')
  , _ = require('underscore')
  , tool = require('../lib/parse-deps-tool')
  , sillyTool = require('../lib/tool')
  , Q = require('q')
  , commontask = require('./task-async-common')
  , matchfiles = require('matchfiles')
  , getdeps = require('../lib/parse-deps')
  , Path = require('path')
  , mkdirp = require('mkdirp')

// function promiseGetdeps(abspath){
//   var defer = Q.defer()
//     , promise = defer.promise
//   getdeps(abspath,function(filepaths){
//     defer.resolve(filepaths)
//   })
//   return promise
// }

// match file --> parse file deps --> combo file --> min file
module.exports = function(cfg,SILLY){
  var defer = Q.defer()
    , promise = defer.promise
    , stream
    , kissmetasks = []
    , pkgroot = SILLY.pkgroot
    , pkgname = SILLY.pkgname
    , opts = {
      pkgpath:pkgroot,
      pkgname:pkgname
    }

  if(!cfg.path){
    // defer.reject('请配置ksmin的path属性')
    // return promise
  }
  stream = matchfiles(SILLY.root,cfg.src,cfg.exclude)
  stream.on('file',function(abs,filename,extname,$){
    kissmetasks.push(
      commontask.getdeps(abs)
      .then(function(filepathslist){
        return Q.all(filepathslist.map(function(abs){
                       return commontask.read(abs)
                     }))
               .then(function(buffers){
                 var allfilecontent = ''

                 // TODO fixmodname 只调用一次
                 buffers.forEach(function(buffer,key){
                   var filecontent = buffer.toString()
                     , fullpath = filepathslist[key]
                   filecontent = tool.fixmodname(filecontent,fullpath,opts)
                   filecontent = tool.fixrequirename(fullpath,opts.pkgpath,opts.pkgname,filecontent)

                   allfilecontent = allfilecontent + ";" + filecontent
                 })

                 console.log('>>>uglify info:')
                 var compressed_code = sillyTool.compress(allfilecontent)
                 console.log('>>>uglify info end')

                 var code = compressed_code

                 var lastfile = filepathslist[filepathslist.length-1]
                   , data = _.extend({
                     filename:filename,
                     basename:Path.basename(abs,'.js'),
                     extname:Path.extname(abs,'.js')
                   },SILLY.var)
                   , filename
                   , modname_org
                   , modname_res

                 filename = sillyTool.makemoney(cfg.dest,$)
                 filename = Mustache.render(filename,data)
                 filename = Path.resolve(SILLY.root,filename)

                 modname_org = tool.getModName(lastfile,Path.dirname(SILLY.pkgroot))
                 modname_res = tool.getModName(filename,Path.dirname(SILLY.pkgroot))

                 if(modname_org != modname_res){
                   code = code.replace(new RegExp(modname_org,'g'),modname_res)
                 }
                 mkdirp(Path.dirname(filename),function(err){
                   if(err) throw err
                   commontask.write(filename,code)
                   .then(function(){
                     console.log('ksmin>>>写入文件')
                     console.log(filename)
                     buildInitFile(modname_org,modname_res)
                   })
                   .fail(function(err){
                     console.log('ksmin>>>写入文件'+filename+'失败')
                     console.log(err)
                   })

                   if(cfg.dest_uncompress){
                     commontask.write(cfg.dest_uncompress,allfilecontent)
                     .then(function(){
                       console.log('ksmin>>>写入文件'+cfg.dest_uncompress+'成功')
                     })
                     .fail(function(err){
                       console.log('ksmin>>>写入文件'+cfg.dest_uncompress+'失败:')
                       console.log(err)
                     })
                   }

                 })
               })
      })
    )
  })
  stream.on('end',function(){
    Q.all(kissmetasks)
    .then(function(){
      defer.resolve(SILLY)
    })
    .fail(function(err){
      defer.reject(err)
    })
  })
  stream.on('error',function(err){
    defer.reject(err)
  })

  function buildInitFile(initmodname,initmodname_fixed){
    // module template data
    var path = cfg.path
      , charset = cfg.charset || 'utf-8'
      , tag = cfg.tag || ''
      , name = SILLY.pkgroot.split('/').pop()

    var local = ''
      , online = ''
      , daily = ''

    var output = '//local test\n'
      , tpl = 'KISSY.config({\n'
              + '    packages:[{name:"{{name}}",path:"{{{path}}}",charset:"{{charset}}",tag:"{{tag}}"}]\n'
            + '});\n'
            + 'KISSY.use("{{{main}}}",function(S,init){init();});\n'

    if(cfg.local_path){
      local = Mustache.render(tpl,{
        path:cfg.local_path,
        name:name,
        charset:charset,
        tag:tag,
        main:initmodname_fixed
      })
    }
    if(cfg.path){
      online = Mustache.render(tpl,{
        path:cfg.path,
        name:name,
        charset:charset,
        tag:tag,
        main:initmodname
      })
    }
    if(cfg.daily_path){
      daily = Mustache.render(tpl,{
        path:cfg.daily_path,
        name:name,
        charset:charset,
        tag:tag,
        main:initmodname
      })
    }
    console.log(local+online+daily)
  }
  return promise
}