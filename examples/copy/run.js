var silly = require("silly")

silly.commands.run("tasks.json",process.cwd())
.then(function(){
  console.log("执行成功");
})
.fail(function(){
  console.log("执行失败");
})