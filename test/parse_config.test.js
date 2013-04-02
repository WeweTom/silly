var ConfigParser = require('../lib/config-parser')
  , config = require('./parse_config.data')

var parser = new ConfigParser(config)

parser.on('task',function(e){
  // e : {taskname,taskconfig,variables}
  console.log(e.taskname,e.taskconfig)
})

parser.on('end',function(e){
  // e.taskconfig is an array of task config
  // console.log(e.taskconfig)
  console.log('end')
})

parser.parse(config)

