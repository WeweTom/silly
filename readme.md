# Silly is builder Kissy


## �˰汾Ϊabc��һ������ȫ��ʵ�� ##

- �򵥵�����

  û��package.json

  û��gruntfile

- ����ϵͳֻ�������õ�����ϵͳ 
  `combo` js�ļ��ϲ�
  `min` js�ļ�ѹ���ļ�
  `ksmin` ���kissy��һ���������񣬰���js��ģ��������ϲ���ѹ����һ��
  `css-combo` css�ϲ�
  `less` less���룬���watch����ʹ��
  `coffee` coffee script �ű����룬���watch����ʹ��
  `watch` �����ļ��仯��Ȼ��ִ���������
  `html2tpl` ��htmlת��Ϊģ��

- ģ�����
  ������kissypieģ��
  
## ����
```shell
silly run
```
  �ͻ��Զ�ȥѰ�ҵ�ǰĿ¼�µ�app.json���ã�����app.json���������������:
  
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

  ��ʾ��ִ��һ��ksmin���񣺷���index.js���ϲ����������ļ���ѹ���󱣴浽`../ks-min-20120312/index-min.js` 
  
## ʾ��
  �鿴examaplsĿ¼

## Ŀ¼ģ��֧��

  ```javascript
  silly add kissypie
  ```
  ������һ��kissypie��Ŀ¼�ṹ

