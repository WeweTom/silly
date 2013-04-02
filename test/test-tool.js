// -*- coding: utf-8; -*-

var util = require('../lib/tool')
  , assert = require('assert')

describe('test util.js',function(){
  it('#makemoney',function(){
    assert.equal(util.makemoney('{{$2}}-{{$1}}',[1,2]),'2-1')
  })
})
