// -*- coding: utf-8; -*-
var Q = require('q')
// unit :: a -> Promise a
var unit = function(input) {
  var defer = Q.defer()
    , promise = defer.promise
  defer.resolve(input);
  return promise
};
// bind :: Promise a -> (a -> Promise b) -> Promise b
var bind = function(input, f) {
  var defer = Q.defer()
    , output = defer.promise
  input.then(function(x) {
    var fx = f(x)
    fx.then(function(y) {
      defer.resolve(y);
    });
    fx.fail(function(y){
      defer.reject(y)
    })
  });
  input.fail(function(x){
    defer.reject(x)
  })
  return output
};
// pipe :: [a] -> [a -> [b]] -> [b]
var pipe = function(x, functions) {
  for (var i = 0, n = functions.length; i < n; i++) {
    x = bind(x, functions[i]);
  }
  return x;
};
var _pipe = function(data,async_tasks){
  var input = unit(data)
  return pipe(input,async_tasks)
}
module.exports = _pipe
