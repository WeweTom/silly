[2013-04-20 六 23:13]
  改进
  - 使用commander来管理命令行帮助
  - 模板生成：silly init pagename -t kissypie 提示覆盖操作
  - 扁平化的json任务配置
    原来的方式

 ```css
 {
   "config" : {
	 "css-combo" : {
	   "第一个css合并任务" : {
		 "src" : ["a.css","b.css"],
		 "min_code" : true,
		 "dest" : "ab.css"
	   }
	 }
   }
 }
 ```
    现在的方式，减少了一层嵌套

 ```css
{
  "tasks" : {
	  "css-combo" : {
		  "src" : ["a.css","b.css"],
		  "min_code" : true,
		  "dest" : "ab.css"
	  }
  }
}
 ```
   如果有多个任务，可以将css-combon 写为数组：

{
  "tasks" : {
	  "css-combo" : [
	    {"src" : ["a.css","b.css"],"min_code" : true,"dest" : "ab.css"},
	    {"src" : ["c.css","d.css"],"dest" : "cd.css"},
	  ]
  }
}

  - 添加命令
    silly compile filename.coffee
    silly compile filename.less

  还是严格按照 silly SUB_COMMAND options的方式来执行
  silly run filename.js
  sillt run filename.less
  
[2013-04-19 五 16:07]
  silly run filename.js			-->  silly filename.js
  sillt run filename.less		-->  silly filename.less
