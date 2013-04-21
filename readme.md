## What is "Silly" 

"Silly" is a builder for frontend engineer

## "Ϭ��"��ʲô��
"Ϭ��"��һ��Ϊǰ�������ƵĴ������

����һ���û���˵���и�package.json��gruntfile�Ǹ��ȽϷ��˵����飬��Ȼ���ǿ����Զ����ɡ��������ܾ���Grunt�����⸴�ӻ���:��װ��һ��Grunt-cli��Ҫ��װlocal��Grunt����Ҫinit�����������ļ�����Ȼ��Ҳ����˵Grunt���бȽϴ������ԣ������������������ԡ�

## install
```sh
$ npm install silly-builder -g
```
## getting started
- ����������
  
  ����㰴�ձ�׼��kissy����ģ������֯���룬��ô�����ڲ������κ����õ�����½���
  kissy��ģ�������������ϲ���ѹ�������뿴examples/ks-min

```shell
$ cd examples/ks-min
$ silly run index.js  # ���Զ�����index.js��������������ϲ�ѹ��Ϊһ��index-min.js�ļ�
```

- �������

  ͨ������app.json�ļ�(����������GruntFile�����Ǹ��Ӽ�ֱ��)��������ִ���������

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

  ���������ļ��������ǣ������ϲ����񣨱��Ǹ�GruntFileֱ�۶��˰ɣ�����
  ��һ��������combo���������������񣬽���ǰĿ¼�µ�a.js b.js�ϲ���һ����ab.js���ļ�����c.js d.js�ϲ�Ϊcd.js
  �ڶ���������css-cobmo,�����������񣬽�a.css b.css�ϲ�Ϊab.css������ִ��cssminѹ��

- ִ����������嵥

```shell
silly run -c app.json
```
  sillyĬ�ϻ�Ѱ�ҵ�ǰĿ¼�µ�app.json�����������������Լ�Ϊ

```shell
silly run
```

## ����ʾ��

### css �ϲ�
   css �ϲ��� js �ϲ�����

```css
{
  "tasks" : {
    "css-combo" : {"src" : ["a.css","b.css"],"min_code" : true,"dest" : "ab.css"}
  }
}
```
  min_code��ʾ��ȥ������Ŀո��ڲ�����cssmin�⣬��Ӧ�ģ�js�ڲ�����uglify��ѹ��

### less ����
Ҫִ��less���빦�ܣ������Ȱ�װlessc

```shell
$ npm install less -g
```

ȫ�ְ�װ��less����������ĳ���ļ�your_page.less��ִ��less��������

```shell
$ lessc your_page.less your_page.css # ��your_page.less����Ϊyour_page.css
```

ʹ��silly��װ��less�������������ʹ��

```shell
$ silly run your_page.less # ��your_page.less����Ϊyour_page.css
```

��less�ļ�һ��һ����ִ�б��룬������Ȼû���⣬���ǣ������ڲ����ʱ�����ֻ�ǲ�������еĶ������֮һ�������ǽ�һ�����迴��һ�����񣬽�������迴��������񣬽���Щ������json������������һ��ִ�С�������ִ�ж������ͷ�����ˣ����Ծ�����gruntjs �� silly ��������ˡ�

silly �� GruntJs�����кܴ�Ĳ�ͬ�ģ���������silly����������������������Ҫ�򵥶���

�����һ������������������Ե����ļ�ִ��lessc����Ĺ�����������:

```javascript
{
  "tasks" : {
    "less" : {"src" : "your_page.less","dest" : "your_page.css"}
  }
}
```
����ִ�ж�����񣬿�������д

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

����Ҫ���ǣ�����Խ�less���������watch�������������

### watch ����:�����ļ��仯��ִ������

���磬������ǰĿ¼�µ�����less�ļ�������less�ļ������仯��ִ��less��������

```javascript
{
  "tasks" : {
    "watch" : {"src" : ["*.less],"tasks" : ["less"]},
    "less" : {"src" : ["main.less"],"dest" : "main.css"}
  }
}
```
### coffee
coffee script�������ż�࣬�Ѿ���Խ��Խ���ǰ�˹���ʦʹ�ã�����coffee֮��js������less֮��css���м���һ��������̡�

Ҫִ���������ҲҪԤ�Ȱ�װcoffee-script������

```shell
$ npm install coffee-script -g  # ����unbuntu����Ҫ�����sudo 
```
һ��coffee�����������������:
```javascript
{
  "tasks" : {
    "coffee" : {"src" : "main.coffee"}
  }
}
```

ע�⣬����������ֻ��src���ԣ���Ϊcoffee������û���ṩ����ļ�����ѡ��main.coffee������main.js�������������ļ�

��less ���� ��coffeeҲ������watch�������ʹ��

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

### compass ����
sassҲ��һ�ַ����cssԤ��������������������ruby����Ҫ�Ȱ�װcompass��ִ�����������ȷ�����Ѿ���װ��compass

```shell
$ compass -v
```

���watch����ִ��compass���������鿴examples/watch-compass

```javascript
{
  "tasks" : {
    "watch" : {"src" : ["sass/*.scss"],"tasks" : ["compass"]},
    "compass" : {
        "src" : "." //��ǰĿ¼����config.rb���ڵ�Ŀ¼
    }
  }
}
```

### htmlת��Ϊ kissy ģ��

js��֧�ֶ����ַ��������ԣ��㲻������python������дһ��HTML�ַ���

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
Python�У��������ھͿ���д�����ַ����ˣ�������js���͵�д��
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
kissy�п��Խ�һ�����ַ�����ģ�����ʽ��֯����
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
���silly������һ������������������kissyģ��

```javascript
{
  "tasks" : {
    "html2tpl" : {"src" : ["pop.html"],"dest" : "{{basename}}.js"}
  }
}
```

## features

- ���ü�
  
- ���õ�����ϵͳ 
  - `combo` js�ļ��ϲ�
  - `min` js�ļ�ѹ���ļ�
  - `ksmin` ���kissy��һ���������񣬰���js��ģ��������ϲ���ѹ����һ��
  - `css-combo` css�ϲ�
  - `less` less���룬���watch����ʹ��
  - `coffee` coffee script �ű����룬���watch����ʹ��
  - `watch` �����ļ��仯��Ȼ��ִ���������
  - `html2tpl` ��htmlת��Ϊģ��
  - `csscombo` TODO

- Ŀ¼ģ��
  �������ɳ�����Ŀ¼ģ��

## Ŀ¼ģ��֧�� TODO

### intro
silly �Ѽ���һд������Ŀ¼�ṹ��������ٹ�����Ŀ

### ����Ŀ¼ģ��

#### kissypie
  kissypie��һ��kissypie�Ƽ���Ŀ¼�ṹ

```shell
$ npm init kissypie		# ������һ��kissypie��Ŀ¼�ṹ
$ cd kissypie			# app.json �������ִ����������
$ silly run
```
#### SinglPage

#### SinglUpPage
