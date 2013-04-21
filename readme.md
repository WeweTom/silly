## What is "Silly" 

"Silly" is a builder for frontend engineer

## "犀利"是什么？
"犀利"是一个为前端量身定制的打包工具

对于一般用户来说，有个package.json和gruntfile是个比较烦人的事情，虽然他们可以自动生成。但是我总觉得Grunt把问题复杂化了:安装了一个Grunt-cli还要安装local的Grunt，还要init，生成配置文件，当然，也可以说Grunt具有比较大的灵活性，但是牺牲的是易用性。

## install
```sh
$ npm install silly-builder -g
```
## getting started
- 零配置运行
  
  如果你按照标准的kissy匿名模块来组织代码，那么可以在不进行任何配置的情况下进行
  kissy的模块依赖分析、合并、压缩具体请看examples/ks-min

```shell
$ cd examples/ks-min
$ silly run index.js  # 会自动搜索index.js的依赖，并将其合并压缩为一个index-min.js文件
```

- 组合任务

  通过创建app.json文件(作用类似于GruntFile，但是更加简单直接)，来配置执行组合任务

```javascript
{
  "tasks" : {
    "combo" : [
	  {"src" : ["a.js","b.js"],"dest" : "ab.js","min_file" : true},
	  {"src" : ["c.js","d.js"],"dest" : "cd.js"}
      ],
    "css-combo" : {"src" : ["a.css","b.css"],"dest" : "ab.css","min_file" : true}
  }
}
```

  这是配置文件描述的是，两个合并任务（比那个GruntFile直观多了吧！）：
  第一个任务是combo，包含两个子任务，将当前目录下的a.js b.js合并成一个叫ab.js的文件，将c.js d.js合并为cd.js
  第二个任务是css-cobmo,不包含子任务，将a.css b.css合并为ab.css，并且执行cssmin压缩

- 执行这个任务清单

```shell
silly run -c app.json
```
  silly默认会寻找当前目录下的app.json，所以上面的命令可以简化为

```shell
silly run
```

## 更多示例

### css 合并
   css 合并和 js 合并类似

```css
{
  "tasks" : {
    "css-combo" : {"src" : ["a.css","b.css"],"min_code" : true,"dest" : "ab.css"}
  }
}
```
  min_code表示会去除多余的空格，内部调用cssmin库，相应的，js内部调用uglify来压缩

### less 编译
要执行less编译功能，必须先安装lessc

```shell
$ npm install less -g
```

全局安装了less后，你可以针对某个文件your_page.less，执行less编译命令

```shell
$ lessc your_page.less your_page.css # 将your_page.less编译为your_page.css
```

使用silly封装了less编译操作，这样使用

```shell
$ silly run your_page.less # 将your_page.less编译为your_page.css
```

对less文件一个一个的执行编译，这样当然没问题，但是，往往在部署的时候，这个只是部署过程中的多个步骤之一——我们将一个步骤看作一个任务，将多个步骤看作多个任务，将这些任务用json来描述，放在一起执行。这样，执行多个步骤就方便多了，所以就有了gruntjs 和 silly 这个工具了。

silly 和 GruntJs还是有很大的不同的，简单来讲，silly正如它名字所表达的那样，要简单多了

如果用一个任务来描述上面针对单个文件执行lessc编译的过程是这样的:

```javascript
{
  "tasks" : {
    "less" : {"src" : "your_page.less","dest" : "your_page.css"}
  }
}
```
批量执行多个任务，可以这样写

```javascript
{
  "tasks" : {
    "less" : [
  	  {"src" : "your_page.less","dest" : "your_page.css"},
	  {"src" : "your_page_2.less","dest" : "your_page_2.css"}    
	]
  }
}
```

更重要的是，你可以将less编译任务和watch任务组合起来用

### watch 任务:监听文件变化后执行任务

比如，监听当前目录下的所有less文件，当有less文件发生变化后，执行less编译任务

```javascript
{
  "tasks" : {
    "watch" : {"src" : ["*.less],"tasks" : ["less"]},
    "less" : {"src" : ["main.less"],"dest" : "main.css"}
  }
}
```
### coffee
coffee script因其优雅简洁，已经被越来越多的前端攻城师使用，但是coffee之与js，正如less之鱼css，中间有一个编译过程。

要执行这个任务也要预先安装coffee-script编译器

```shell
$ npm install coffee-script -g  # 对于unbuntu或许要求加上sudo 
```
一个coffee任务的描述是这样的:
```javascript
{
  "tasks" : {
    "coffee" : {"src" : "main.coffee"}
  }
}
```

注意，任务配置中只有src属性，因为coffee编译器没有提供输出文件名的选择，main.coffee会编译成main.js而不能是其他文件

与less 类似 ，coffee也可以与watch命令配合使用

```javascript
{
  "tasks" : {
    "watch" : [
	  {"src" : ["*.less],"tasks" : ["less"]},
	  {"src" : ["*.coffee],"tasks" : ["coffee"]}
	],
    "less" : {"src" : ["*.less"],"dest" : "{{basename}}.css"},
    "coffee" : {"src" : "*.coffee"}
  }
}
```

### compass 任务
sass也是一种方便的css预处理器，但是因其依赖ruby，需要先安装compass。执行下面的命令确定你已经安装了compass

```shell
$ compass -v
```

配合watch任务执行compass命令。具体请查看examples/watch-compass

```javascript
{
  "tasks" : {
    "watch" : {"src" : ["sass/*.scss"],"tasks" : ["compass"]},
    "compass" : {
        "src" : "." //当前目录，即config.rb所在的目录
    }
  }
}
```

### html转换为 kissy 模板

js不支持多行字符串，所以，你不能像在python中这样写一段HTML字符串

```python
'''
<div class="hd">
	this is hd
</div>
<div class="bd">
	this is bd
</div>
<div class="ft">
	this is foot
</div>
'''
```
Python中，三引号内就可以写多行字符串了，但是在js里，你就得写成
```javascript
'<div class="hd">'
	+'this is hd'
+'</div>'
+'<div class="bd">'
	+'this is bd'
+'</div>'
+'<div class="ft">'
	+'this is foot'
+'</div>'
```
kissy中可以将一个大字符串以模块的形式组织起来
```javascript
KISSY.add(function(){
return ""
+'<div class="hd">'
	+'this is hd'
+'</div>'
+'<div class="bd">'
	+'this is bd'
+'</div>'
+'<div class="ft">'
	+'this is foot'
+'</div>';
})
```
因此silly集成了一个任务来生成这样的kissy模块

```javascript
{
  "tasks" : {
    "html2tpl" : {"src" : ["pop.html"],"dest" : "{{basename}}.js"}
  }
}
```

## features

- 配置简单
  
- 常用的任务系统 
  - `combo` js文件合并
  - `min` js文件压缩文件
  - `ksmin` 针对kissy的一个集成任务，包括js的模块分析、合并、压缩于一体
  - `css-combo` css合并
  - `less` less编译，配合watch任务使用
  - `coffee` coffee script 脚本编译，配合watch任务使用
  - `watch` 监听文件变化，然后执行相关任务
  - `html2tpl` 将html转化为模板
  - `csscombo` TODO

- 目录模板
  快速生成常见的目录模板

## 目录模板支持 TODO

### intro
silly 搜集了一写常见的目录结构，方便快速构建项目

### 内置目录模板

#### kissypie
  kissypie是一套kissypie推荐的目录结构

```shell
$ npm init kissypie		# 将创建一个kissypie的目录结构
$ cd kissypie			# app.json 配置完后执行下面命令
$ silly run
```
#### SinglPage

#### SinglUpPage
