var Path = require('path')
  , uglify = require('uglify-js')
  // , charset = require('jschardet')
  , charset = new Function()

function getPkgnameFromDir(s){
  return Path.basename(s)
}
exports.getPkgnameFromDir = getPkgnameFromDir

function isArray(o){
  return toString.call(o) === '[object Array]'
}
exports.isArray = isArray

function isString(o){
  return toString.call(o) === '[object String]'
}
exports.isString = isString

function fixwindsep(arr){
  var re = /\//g
  if(isString(arr)){
    return arr.replace(re,'/')
  }else{
    return arr.map(function(s){
             return s.replace(re,'/')
           })
  }
}
exports.fixwindsep = fixwindsep


exports.compress = function(allfilecontent){
  var toplevel = uglify.parse(allfilecontent)
  toplevel.figure_out_scope()
  var compressor = uglify.Compressor();
  var compressed_ast = toplevel.transform(compressor);

  compressed_ast.figure_out_scope();
  compressed_ast.compute_char_frequency();
  compressed_ast.mangle_names();
  var code = compressed_ast.print_to_string({'ascii_only':true});
  return code
}

exports.transformfilename = function(fullpath,ext_from,ext_to){
  var basename = Path.basename(fullpath,ext_from)
    , dirname = Path.dirname(fullpath)
    , ret
  ext_to || (ext_to = '-min.js')
  ret = dirname+'/'+basename+ext_to
  return ret
}

// makemoney('{{$a}}-{{$b}}',[1,2])  -> 1-2
exports.makemoney = function(str,arr){
  return str.replace(/{{\$(\d+?)}}/g,function(a,a_1,b,c){
           var i = (a_1-1)
           return arr[i] || ''
         })
}

exports.throttle = function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
              fn.apply(context, args);
            }, delay);
  };
}
exports.getCharsetFromBuffer = function(buf){
  var result = charset.detect(buf)
    , c = result.encoding
    , ret
  if(result.confidence < .8){
    console.warn('[warn]'+' 对文件的编码识别准确度小于0.8');
  }
  console.log('detect charset :',c);
  if(c.indexOf('ascii') > -1){
    ret = undefined;
  }else if(c.indexOf('gb') > -1){
    ret = 'gbk'
  }else if(c.indexOf('utf')){
    ret = 'utf-8'
  }
  return;
}
exports.buf2string = function(buf){
  var charset = this.getCharsetFromBuffer(buf)
  // console.log('charset detect : ', charset)
  return buf.toString();
}
