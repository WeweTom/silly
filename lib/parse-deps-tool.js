var path = require('path')
  , fs = require('fs')

/**
 * 给匿名的包添加包名
 * @param content
 * @param p 文件路径
 * @param opts {pkgpath,pkgname}
 * */
function fixmodname(content,p,opts){
  if(opts && opts.pkgpath && opts.pkgname){
    var pkgpath = opts.pkgpath
      , pkgname = opts.pkgname
    if(pathcontains(p,opts.pkgpath)){
      var slicer = '.add(',
          len = slicer.length,
          i = content.indexOf(slicer);
      if(content.slice(i+len,i+len+8) == 'function'){
        var modname = p.replace(pkgpath,pkgname).replace(/\.js$/,'');
        modname = modname.replace(/\\/g,'/')
        content = content.slice(0,i+5)+'"'+modname+'",'+content.slice(i+5);
      }
      return content;
    }else{
      console.error('path error : filepath "'+p+'" should contains pkg path "'+ opts.pkgpath +'"')
      throw Error('path error : filepath "'+p+'" should contains pkg path "'+ opts.pkgpath +'"')
    }
  }else{
    throw Error('options are neeeded');
  }
  return ''
}
/**
 * 修复依赖包的路径
 * */
function fixrequirename(fullpath,pkgdir,pkgname,content){
  var rewinslash = /\\/g
  pkgdir = pkgdir.replace(rewinslash,'/')
  var mods
    , dirname
    , re = new RegExp(pkgdir,'g')
    , relative = /^"\./

  dirname = path.dirname(fullpath);

  mods = getModsFromString(content);
  mods = mods.map(function(i){
           var mod;
           if(relative.test(i)){
             i = i.replace('"','').replace('"','');
             mod = path.resolve(dirname,i);
             mod = mod.replace(rewinslash,'/')
             mod = mod.replace(re,pkgname);
             mod = '"'+mod+'"';
           }else{
             //mod  = '"'+i+'"';
             mod = i;
           }
           return mod;
         });
  content = content.replace(modsREG,'requires:['+mods+']');
  return content;
}

var modsREG = /requires:\[(.*?)\]/
function getModsFromString(s){
  s = clearStr(s);
  var r,depStr,dep=[]
  r = modsREG.exec(s);
  if(r && r.length){
    depStr = r[1];
    depStr = depStr.replace(/\'/g,'"');
    dep = depStr.split(',');
  }
  return dep;
}

/**
 * test if path A contains B
 * */
function pathcontains(A,B){
  A = path.resolve(A);
  B = path.resolve(B);
  return A.indexOf(B) === 0;
}

function getModName(fullpath,pkgroot){
  if(pathcontains(fullpath,pkgroot)){
    return path.dirname(fullpath.replace(pkgroot+'/',''))
  }else{
    throw Error('fullpath: '+fullpath+' should contains'+' pkgroot: ' + pkgroot)
  }
}
exports.getModName = getModName
/**
 * 清除apppath之外的路径
 * */
function clearPathArr(patharr,appbasedir){
  return patharr.filter(function(i){
           return pathcontains(i,appbasedir);
         });
}

function unique(arr) {
  var ret = [ ], temp = { }, elt;
  for (var i = 0; i < arr.length; i++) {
	elt = arr[i];
	if (!temp[elt]) {
	  temp[elt] = true;
	  ret.push(elt);
	}
  }
  return ret;
};

/**
 * @param pathArr
 * @param opts combo文件的时候需要fix包名
 *       {pkgpath,pkgname,forcecombo}
 * @cb
 * */
function combo(pathArr,opts,cb){
  var comboArr = [],
      counter,
      combofiles
  if(!opts.forcecombo){
    //若不强制combo，则去除app之外的路径
    pathArr = clearPathArr(pathArr,opts.appbasedir);
  }
  combofiles = '/**\n *gen by sb\n *combo files:\n\n'+pathArr.join('\n')+'\n\n*/\n';
  counter = pathArr.length,
  pathArr.forEach(function(p,k){
    fs.readFile(p,function(err,data){
      if(err) throw err;
      var filecontent = data.toString();

      filecontent = fixmodname(filecontent,p,opts);
      comboArr[k] = fixrequirename(p,opts.pkgpath,opts.pkgname,filecontent);
      counter--;
      if(counter<=0){
        cb && cb(combofiles+comboArr.join(';'),comboArr[k]);
      }
    });
  });
}
function clearStr(s){
  return s.replace(/\s/g,'');
}

exports.unique = unique;
exports.combo = combo;
exports.getModsFromString = getModsFromString;
exports.clearStr = clearStr;
exports.fixmodname = fixmodname
exports.fixrequirename = fixrequirename;