// -*- coding: utf-8; -*-
function html2tpl(str){
  str = str.replace(/'/g, "\\'")
  str = str.replace(/^(\s*)(\S)/gm
                   , function(){
                       var line = 0;
                       return function(){
                         line++;
                         if(line!==1){
                           return RegExp.$1+"+'"+RegExp.$2;
                         }else{
                           return "'"+RegExp.$2;
                         }
                       }
                     }());
  str = str.replace(/\r\n|\r|\n/g, "'\n");
  str = str.slice(0,-1)

  return 'KISSY.add(function(){\nreturn ""\n+'+str+';\n})';
}

module.exports = html2tpl

