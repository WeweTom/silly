// -*- coding: utf-8-unix; -*-
var fs = require('fs')
  , _ = require('underscore')
  , Q = require('q')
  , Path = require('path')
  , tool = require('./lib/tool')
  , matchfiletool = require('matchfiles/lib/util')
  , pipe = require('./lib/pipe')
  , optimist = require('optimist')
  , Mustache = require('mustache')
  , argv = optimist.argv
  , ConfigParser = require('./lib/config-parser')
  , TaskCommon = require('./tasks/task-async-common')
  , TaskGenerator = require('./lib/task-generator')
  , Tasks = require('./lib/tasks')
  , mkdirp = require('mkdirp')
  , BASE_DIR = Path.dirname(__filename)
  , pargv = process.argv
  , matchfiles = require('matchfiles')
  , TemplateManager = require('./lib/template-manager')
  , uglify = require("uglify-js")
  , deptool = require('./lib/parse-deps-tool')

function exp(){
  var cwd = process.cwd()
    , cfgfile = argv.c || argv.config || 'app.json'
    , cmd = pargv[2]
  switch(cmd){
    case "init":
    init();break;
    // case "run":
    // run(cwd,cfgfile);break;
    default:
    run(cwd,cfgfile);break;
  }
}
module.exports = exp;
// 添加目录模板
function init(){
  argv = optimist.alias('t','type')
         .describe('t','初始项目类型')
         // .alias('d','dir')
         // .describe('d','初始目录名')
         .alias('f','force')
         .describe('f','不论当前目录是否为空，强制初始化目录[小心!]')
         .usage('Init a abc task in current directory.\nUsage: silly')
         // .demand(['d'])
         .argv

  var cwd = process.cwd()
    , dirtype = argv.t || 'kissypie'
    , dirname = pargv[3]
    , force = !!argv.f

  switch(dirtype){
    case 'kissypie':
      TemplateManager.initKissyPie(dirname,cwd,force)
      .then(function(){
      })
      .fail(function(err){
        console.log(err)
      })
      break;
    default:
      TemplateManager.initKissyPie(dirname,cwd)
  }
}

function run(cwd,cfgfile){
  var pkgroot
    , pkgname
    , jsonconfig
    , taskqueue = []
    , root
    , SILLY = {}

  SILLY.Tasks = Tasks

  if(!matchfiletool.isAbsolutePath(cfgfile)){
    cfgfile = Path.resolve(cwd,cfgfile)
    root = Path.dirname(cfgfile)
  }else{
    root = Path.dirname(cfgfile)
  }
  SILLY.root = root
  TaskCommon.read(cfgfile)
  .then(function(buffer){
    // jsonconfig = JSON.parse(buffer.toString())
    jsonconfig = eval('('+buffer.toString()+')')

    SILLY.config = jsonconfig

    pkgroot = jsonconfig.pkgroot || cwd
    pkgroot = Path.resolve(pkgroot)

    pkgname = tool.getPkgnameFromDir(pkgroot)

  })
  .fail(function(err){
    console.warn('>>>does not find find config file,use current dir as pkg root')
    pkgroot = cwd
    pkgname = tool.getPkgnameFromDir(pkgroot)
  })
  .fin(function(){
    SILLY.pkgroot = pkgroot
    SILLY.pkgname = pkgname
    if(jsonconfig){
      var configparser
        , hasnottask = true
        , errorstack = []
      configparser = new ConfigParser()
      configparser.on('task',function(e){
        hasnottask = false

        if(e.taskname == 'include'){
          console.log('>>>execute include task')
          var src = e.taskconfig.src
          if(tool.isString(src)){
            src = [src]
          }
          console.log(src.join('\n'))
          src.forEach(function(s){
            var configfilepath = Path.resolve(root,e.taskconfig.src)
              , configroot = Path.dirname(configfilepath)
            run(configroot,configfilepath)
          })
          return
        }


        var taskpath = Tasks[e.taskname]
          , task = taskpath && require(taskpath)
          , taskconfig = e.taskconfig
          , taskname = e.taskname
        taskpath = Tasks[e.taskname]
        taskconfig = e.taskconfig
        taskname = e.taskname
        // try{
        //   task = taskpath && require(taskpath)
        // }catch(e){
        //   console.log(e)
        //   return
        // }
        if(!task){
          try{
            task = require(e.taskname)
          }catch(e){
            console.log(e)
            errorstack.push('未发现第三方插件:'+taskname)
            errorstack.push('请尝试:')
            errorstack.push('npm instasll '+taskname)
            return
          }
        }
        if(task){
          taskqueue.push(TaskGenerator(task,taskconfig,exp))
        }else{
          console.error('未定义的task:'+e.taskname)
        }
      })
      configparser.on('end',function(){
        if(hasnottask){
          console.log('>>>未定义任何有效的任务')
          return
        }
        if(errorstack.length){
          console.log(errorstack.join('\n'))
          return
        }
        pipe(SILLY,taskqueue)
        .then(function(){
          // console.log('[success]')
        })
        .fail(function(err){
          console.log('[failed]')
          console.log(err)
        })
        .fin(function(){
          // console.log('[end]')
        })
      })
      configparser.parse(jsonconfig)
    }else{
      // if(pargv[2] !== run){}
      var files = pargv.slice(3)
      if(files.length){
        files.forEach(function(file){
          var dest = tool.transformfilename(file,'-min.js')
          var taskconfig = {
            dest:dest,
            src:[file],
            combo_file:true
          }
            , task = require(Tasks.ksmin)
          taskqueue.push(TaskGenerator(task,taskconfig))
        })

        console.log('>>>execute default task ksmin...')

        pipe(SILLY,taskqueue)
        .then(function(){
          console.log('>>>done')
        })
        .fail(function(err){
          console.log('>>>fail:',err)
        })

      }else{
        console.warn('>>>does not find find any file')
        console.log('>>>usage:')
        console.log('silly run filename.js')
      }
    }
  })
}

// 导出可能用到的库以及工具集
exp.Q = Q
exp.tool = tool
exp.matchfiles = matchfiles
exp._ = _
exp.optimist = optimist
exp.Mustache = Mustache
exp.pipe = pipe
exp.asynctasks = TaskCommon
exp.mkdirp = mkdirp
exp.uglify = uglify
exp.deptool = deptool