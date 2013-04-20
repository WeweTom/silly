// -*- coding: utf-8; -*-
function eval2(s){
  s = '('+s+')';
  var o
    , l
  o = eval(s)
  function e(ss){
    return eval(ss);
  }
  o = e.call(o,s);
  return o;
}
module.exports = eval2;