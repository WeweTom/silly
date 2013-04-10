## What is "Silly" | "Ϭ��"��ʲô��

"Silly" is a builder for frontend engineer

"Ϭ��"��һ��Ϊǰ�������ƵĴ������

## install
```sh
$ npm install silly-builder -g
```
## features

- �򵥵�����

  û��package.json

  û��gruntfile

- ����ϵͳֻ�������õ�����ϵͳ 
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

## getting started
- ����������
  
  ����㰴�ձ�׼��kissy����ģ������֯���룬��ô�����ڲ������κ����õ�����½���
  kissy��ģ�������������ϲ���ѹ�������뿴examples/ks-min

```shell
$ cd examples/ks-min
$ silly run index.js  # ���Զ�����index.js��������������ϲ�ѹ��Ϊһ��index-min.js�ļ�
```

- ���ӵ��������

  ͨ������app.json�ļ���������ִ�и��ӵ��������

```javascript
{
  "config" : {
    "combo" : {
      "��һ��js combo����" : {
        "src" : ["a.js","b.js"],
        "dest" : "ab.js",
		"min_file" : true
      },
      "�ڶ���js combo����" : {
        "src" : ["c.js","d.js"],
        "dest" : "cd.js"
      }
    },
    "css-combo" : {
      "��һ��css combo����" : {
        "src" : ["a.css","b.css"],
        "dest" : "ab.css",
		"min_file" : true
      }
    }
  }
}
```

  ��ʾ����˼�ǽ���ǰĿ¼�µ�a.js b.js�ϲ���һ����ab.js���ļ�

- ִ���������

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
  "config" : {
    "css-combo" : {
      "��һ��css�ϲ�����" : {
        "src" : ["a.css","b.css"],
        "min_code" : true,
        "dest" : "ab.css"
      }
    }
  }
}
```
  min_code��ʾ��ȥ������Ŀո��ڲ�����css_min�⣬��Ӧ�ģ�js�ڲ�����uglify��ѹ��

### less ����
Ҫִ��less���빦�ܣ������Ȱ�װlessc

```shell
$ npm install less -g
```

ȫ�ְ�װ��less����������ĳ���ļ�your_page.less��ִ��less��������

```shell
$ lessc your_page.less your_page.css
```
������Ȼû���⣬���ǣ������ڲ����ʱ�����ֻ�ǲ�������еĶ������֮һ�������ǽ�һ�����迴��һ�����񣬽�������迴��������񣬽���Щ������json������������һ��ִ�С�������ִ�ж������ͷ�����ˣ����Ծ�����gruntjs �� silly ��������ˡ�

silly �� GruntJs�����кܴ�Ĳ�ͬ�ģ���������silly����������������������Ҫ�򵥶���

�����һ������������������Ե����ļ�ִ��lessc����Ĺ�����������:

```javascript
{
  "config" : {
    "less" : {
      "��һ��less����" : {
        "src" : "your_page.less",
        "dest" : "your_page.css"
      }
    }
  }
}
```
����ִ�ж�����񣬿�������д

```javascript
{
  "config" : {
    "less" : {
      "��һ��less����" : {
        "src" : "your_page.less",
        "dest" : "your_page.css"
      },
      "�ڶ���less����" : {
        "src" : "your_page_2.less",
        "dest" : "your_page_2.css"
      }
    }
  }
}
```

����Ҫ���ǣ�����Խ�less���������watch�������������
### watch ����:�����ļ��仯��ִ������

���磬������ǰĿ¼�µ�����less�ļ�������less�ļ������仯��ִ��less��������

```javascript
{
  "config" : {
    "watch" : {
      "һ��watch����" : {
        "src" : ["*.less],
        "tasks" : ["less"]
      }
    },
    "less" : {
      "һ��less��������" : {
        "src" : ["main.less"],
        "dest" : "main.css"
      }
    }
  }
}
```
### coffee
coffee script�������ż�࣬�Ѿ���Խ��Խ���ǰ�˹���ʦʹ�ã�����coffee֮��js������less֮��css���м���һ��������̡�

Ҫִ���������ҲҪԤ�Ȱ�װcoffee-script������

```shell
$ npm install coffee-script -g
```
һ��coffee�����������������:
```javascript
{
  "config" : {
    "coffee" : {
      "һ��coffee��������" : {
        "src" : "main.coffee"
      }
    }
  }
}
```

ע�⣬����������ֻ��src���ԣ���Ϊcoffee������û���ṩ����ļ�����ѡ��main.coffee������main.js�������������ļ�

��less ���� ��coffeeҲ������watch�������ʹ��

```javascript
{
  "config" : {
    "watch" : {
      "less�������" : {
        "src" : ["*.less],
        "tasks" : ["less"]
      },
      "coffe�������" : {
        "src" : ["*.coffee],
        "tasks" : ["coffee"]
      }
    },
    "less" : {
      "����less" : {
        "src" : ["*.less"],
        "dest" : "{{basename}}.css"
      }
    },
    "coffee" : {
      "����coffee" : {
        "src" : "*.coffee"
      }
    }
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
  "config" : {
    "watch" : {
      "a watch task" : {
        "src" : ["sass/*.scss"],
        "tasks" : ["compass"]
      }
    },
    "compass" : {
      "compass task" : {
        "src" : "." //��ǰĿ¼����config.rb���ڵ�Ŀ¼
      }
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
  "config" : {
    "html2tpl" : {
      "����kissyģ��" : {
        "src" : ["pop.html"],
        "dest" : "{{basename}}.js"
      }
    }
  }
}
```
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


