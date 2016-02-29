---
layout:     post
title:      "typeof 和 instanceof 判断变量类型"
subtitle:   "typeof 和 instanceof 判断变量类型"
date:       2016-02-28 16:00:00
author:     "hj"
header-img: "img/post-bg-2015.jpg"
tags:
    - typeof
    - instanceof
    - 原型链
---

## typeof 和 instanceof 判断变量类型

### typeof

> typeof的返回值是一个字符串,一般只能返回一下几个结果: string number boolean objeat function undefined;

```javascript
	var a = 'string';
	typeof a;	//string

	var b = 123;
	typeof b;	//number
	
	var c = true;
	typeof c;	//boolean

	var d = [];
	var e = {};
	typeof d; 	//object
	typeof e;	//object

	var f = function (){};
	typeof f; 	//function

	var g;
	typeof g;	//undefined;
```

由上面代码可以看出 数组 和 对象 用typeof是不能被准确的判断出来的.

### instanceof 

> instanceof 用于判断一个变量是否某个对象的实例

```javascript
	var a = [];
	a instanceof Object;	//true, array 是 object 的子类
	a instanceof Array;		//true

	var b = {};
	b instanceof Object; 	//true
	b instanceof Array;		//false
```

所以当我们需要判断一个变量是数组还是对象时,即可这样判断

```javascript
	function objType(param){
		var type = "";
		if(param instanceof Array && param instanceof Object){
			type = "array";
		}else if(param instanceof Object){
			type = "object";
		}
		return type;
	}
	var a = [];
	objType(a);		//array;
	var b = {};
	objType(b);		//object;
```