## What is "Silly" 

"Silly" is a task runner

## "犀利"是什么？
"犀利"是一个为前端量身定制的任务执行工具

"犀利"采用简洁的json配置文件

对于一般用户来说，有个package.json和gruntfile是个比较烦人的事情，虽然他们可以自动生成。但是我总觉得Grunt把问题复杂化了:安装了一个Grunt-cli还要安装local的Grunt，还要init，生成配置文件，当然，也可以说Grunt具有比较大的灵活性，但是牺牲的是易用性。

## install
```sh
$ npm install silly-builder -g
```
## 文件合并

### 建立一个任务清单tasks.json

```javascript
{
  "tasks":{
	  "combo":{"src" : ["a.js","b.js"],"dest" : "ab.js","min_file" : true}
	}
}
```

  表示合并当前目录下的a.js b.js为ab.js，并且压缩

### 执行命令
```shell
silly run tasks.json
```
完成上面任务清单的任务

## 联系我
   cookieu<AT>gmail.com
