var watch = require('watch')

watch.createMonitor('./test',function(monitor){
  monitor.on('changed',function(f,cur,prev){
    console.log(arguments)
  })
})