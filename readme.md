# Silly is builder Kissy


## 此版本为abc的一个不完全的实现 ##

- 简单的配置

  没有package.json

  没有gruntfile

- 任务系统只包含常用的任务系统 
  `combo` js文件合并
  `min` js文件压缩文件
  `ksmin` 针对kissy的一个集成任务，包括js的模块分析、合并、压缩于一体
  `css-combo` css合并
  `less` less编译，配合watch任务使用
  `coffee` coffee script 脚本编译，配合watch任务使用
  `watch` 监听文件变化，然后执行相关任务
  `html2tpl` 将html转化为模板

- 模板机制
  包含了kissypie模板
  
## 运行
```shell
silly run
```
  就会自动去寻找当前目录下的app.json配置，比如app.json里的内容是这样的:
  
```javascript
{
  "pkgroot":"../",
	"config":{
			"var" : {
				"timestamp" : "20120312"
			},
			"min" : {
				"a" : {
					"src" : ["index.js"],
					"dest" : "../ks-min-{{timestamp}}/index-min.js"
				}
			}
	}
}

```

  表示将执行一个ksmin任务：分析index.js，合并其依赖的文件，压缩后保存到`../ks-min-20120312/index-min.js` 
  
## 示例
  查看examapls目录

## 目录模板支持

  ```javascript
  silly add kissypie
  ```
  将创建一个kissypie的目录结构

