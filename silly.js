// -*- coding: utf-8-unix; -*-
var fs = require('fs')
  , npmpkg = require('./package.json')
  // , charset = require('jschardet') //这个探测很残废
  , _ = require('underscore')
  , Q = require('q')
  , Path = require('path')
  , tool = require('./lib/tool')
  , matchfiletool = require('matchfiles/lib/util')
  , pipe = require('./lib/pipe')
  , program = require('commander')
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
  , cwd = process.cwd()
  , programargs
  , cmd = 'silly'
  , subcmd
  , commandWhiteList = ['init','run','compile','watch']
  , cmdTaskExtWl = ['.js','.less','.coffee']

function help(){
  console.log('')
  console.log('  Usage: silly [command_name] [options]');
  console.log('')
  console.log('  command_name:')
  console.log('')
  console.log('    '+commandWhiteList.join(' '))

  console.log('')
  console.log('  Options: ')
  console.log('')
  console.log('    -h, --help')
  // console.log('    -c, --config_json   a json config file')
  console.log('')

  console.log('  Example: ')
  console.log('')
  console.log('    silly run tasks.json')
  console.log('    silly init pagename')
  console.log('    silly compile filename.less')
  console.log('    silly compile filename.coffee')
  console.log('')
}

function exec(){
  subcmd = pargv[2]

  if(commandWhiteList.indexOf(subcmd) == '-1'){
    help();
    return;
  }

  //program.version(npmpkg.version);
  switch(subcmd){
    case "init":
    program.usage(subcmd+' [options] [values ...]')
    program.option('-t, --type <string>','input a folder type')
    program.parse(pargv);
    break;
    case "run":
    program.usage(subcmd+' tasks.json')
    // program.usage(subcmd+' [options] [values ...]')
    // program.option('-c, --config_json <string>','input a json config')
    case "compile":
    program.usage(subcmd+' filename.less [filename.css]')
    case "watch":
    program.usage(subcmd+' filename.less [filename.css]')
    break;
    //run(cwd,cfgfile);break;
  }
  program.parse(pargv);
  // var cfgfile = program.config || 'app.json'
  var cfgfile;
  if(subcmd == 'run'){
    if(pargv[3]){// task.json
      cfgfile = pargv[3];
    }else{
      cfgfile = 'tasks.json';
    }
  }
  if(subcmd == 'init'){
    init();
  // }else if(subcmd == 'watch'){
  }else{
    run(cwd,cfgfile);
  }
}

var exp = module.exports = {}
exp.exec = exec;

// 添加目录模板
var folderTypeWhiteList = ['kissypie']

function init(){
  var dirtype;

  if(program.type && folderTypeWhiteList.indexOf(program.type) > -1){
    dirtype = program.type;
  }else{
    dirtype = 'kissypie';
  }

  var dirname = pargv[3]
    , force = !!program.force

  if(dirname && dirname[0] == '-'){
    console.log('usage :');
    console.log('  silly init PageName OPTIONS');
    console.log('');
    console.log('  OPTIONS');
    console.log('  -f : force init');
    process.exit();
  }
  switch(dirtype){
    case 'kissypie':
      TemplateManager.initKissyPie(dirname,cwd,force,exp)
      .then(function(){
      })
      .fail(function(err){
        console.log(err)
        program.help();
      })
      break;
  }
}

/**
 * @return promise
 * */
function run(cwd,cfgfile){
  var defer = Q.defer()
    , promise = defer.promise

  var pkgroot
    , pkgname
    , jsonconfig
    , taskqueue = []
    , root
    , SILLY = {}

  SILLY.Tasks = Tasks

  if(cfgfile && !matchfiletool.isAbsolutePath(cfgfile)){
    cfgfile = Path.resolve(cwd,cfgfile)
    root = Path.dirname(cfgfile)
  }else{
    root = Path.dirname(cfgfile)
  }
  SILLY.root = root

  function err(){
    pkgroot = cwd
    pkgname = tool.getPkgnameFromDir(pkgroot)
    defer.reject()
  }
  function fin(){
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

        if(!task){
          try{
            task = require(e.taskname);
          }catch(err){
            taskname = e.taskname;
            errorstack.push('  未发现第三方插件:'+e.taskname)
            errorstack.push('')
            errorstack.push('  尝试下面的命令进行安装:')
            errorstack.push('    npm instasll '+e.taskname)
            console.log(e)
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
          defer.reject("未定义任何有效的任务");
          return
        }
        if(errorstack.length){
          console.log(errorstack.join('\n'))
          defer.reject(errorstack.join('\n'));
          return
        }
        pipe(SILLY,taskqueue)
        .then(function(){
          console.log('[success]')
          defer.resolve();
        })
        .fail(function(err){
          console.log('[failed]')
          console.log(err)
          defer.reject(err);
        })
        .fin(function(){
          console.log('[end]')
        })
      })
      configparser.parse(jsonconfig)
    }else{
      var files;
      files = pargv.slice(3);
      if(files.length){
        if(subcmd == 'watch'){
          // do watch task
        }else{
          files.forEach(function(file){
            var dest
              , taskconfig
              , task
              , extname = Path.extname(file);
            if(extname == '.js'){
              dest = tool.transformfilename(file,'.js','-min.js')
              taskconfig = {
                dest:dest,
                src:[file],
                combo_file:true
              }
              task = require(Tasks.ksmin)
            }else if(extname == '.less'){
              dest = tool.transformfilename(file,'.less','-min.css')
              taskconfig = {
                src : [file],
                dest : dest
              }
              task = require(Tasks.less);
            }else if(extname == '.coffee'){
              taskconfig = {
                src:[file]
              }
              task = require(Tasks.coffee);
            }else{
              console.log('>>>')
              console.log('       只能 silly run script_name.js')
              console.log('       或者 silly run less_file.less');
              return;
            }
            taskqueue.push(TaskGenerator(task,taskconfig));
          })
        }
        pipe(SILLY,taskqueue)
        .then(function(){
          console.log('>>>done')
          defer.resolve();
        })
        .fail(function(err){
          console.log('>>>fail:',err)
          defer.reject();
        })
      }else{
        console.warn('>>> does not find find any file')
        console.log('>>> usage:')
        console.log('          只能执行silly run script_name.js')
        console.log('            或者：');
        console.log('          只能执行silly run less_file.less');
        defer.reject();
      }
    }
  }

  if(cfgfile){
    TaskCommon.read(cfgfile)
    .then(function(buffer){
      // jsonconfig = JSON.parse(buffer.toString())

      // nodejs 对多编码的支持真是……
      // jsonconfig = eval('('+tool.buf2string(buffer)+')');
      try{
        jsonconfig = eval('('+buffer.toString()+')');
      }catch(e){
        console.log(e);
        defer.reject();
        return;
      }

      SILLY.config = jsonconfig

      pkgroot = jsonconfig.pkgroot || cwd
      pkgroot = Path.resolve(pkgroot)
      pkgname = tool.getPkgnameFromDir(pkgroot)

    })
    .fail(function(err){
      console.log(err);
      console.warn('>>>does not find find config file,use current dir as pkg root')
      err();
    })
    .fin(fin)
  }else{
    err();
    fin();
  }
  return promise;
}

// 对外export可编程的接口
var commands = exp.commands = {};
/**
 * 从文件执行一个任务清单
 * @param tasks_json_file 任务清单路径
 * @param root 查找根路径 optional
 * */
commands.run = function(tasks_json_file,root){
  root || (root = cwd);
  return run(root,tasks_json_file);
}

//从json对象执行一个任务清单
commands.exec = function(){}

// 导出可能用到的库以及工具集
exp.Q = Q
exp.tool = tool
exp.matchfiles = matchfiles
exp._ = _
exp.pipe = pipe
exp.asynctasks = TaskCommon
exp.mkdirp = mkdirp
exp.uglify = uglify
exp.deptool = deptool
exp.program = program