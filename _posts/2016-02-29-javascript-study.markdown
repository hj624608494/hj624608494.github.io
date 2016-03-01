---
layout:     post
title:      "JavaScript基础知识总结"
subtitle:   "JavaScript基础知识总结"
date:       2016-02-29 16:00:00
author:     "hj"
header-img: "img/post-bg-2015.jpg"
tags:
    - 数据类型
    - 面向对象
    - 闭包
---

## JS基本类型有什么? 引用类型(对象类型)有什么?
* 基本类型: number, string, boolean, undefined, null
* 引用类型: object, array, function, date等等

### 概括起来有这么几个要点:

1.我们无法给基本类型的对象添加属性和方法;

```javascript
    var a = 1;
    a.name = 'test';
    console.log(a.name);    //undefined;
```

2.基本类型对象的比较是值比较,而引用类型对象的比较是引用比较;

```javascript
    var a = 1,
        b = 1;
    console.log(a === b);   //true;

    var c = {},
        d = {};
    console.log(c === d);   //false;
```

3.基本类型对象时存储在栈内存中的,而引用类型对象其实是一个存储在真内存中的一个堆内存地址.

基本类型
![](https://segmentfault.com/img/bVs2sP)

引用类型
![](https://segmentfault.com/img/bVs2sR)

4.基本类型对象赋值时(执行=号操作), 是在栈内存中创建一个新的空间, 然后将值复制一份到新的空间里.
![](https://segmentfault.com/img/bVs2sU)

5.引用类型对象赋值时(执行=号操作), 也是在栈内存中国复制一份一样的值, 但这个值是一个内存地址, 所有被复制的那个对象跟前者其实是一个对象.
![](https://segmentfault.com/img/bVs2s8)

```javascript
    var a = {};
    var b = a;

    a.name = 'abc';
    console.log(a.name);    //abc;
    console.log(b.name);    //abc;

    b.age = 23;
    console.log(b.age);     //23;
    console.log(a.age);     //23;
```

## JS中常见内置对象类
js的常见内置对象类: Date, Array, Math, Number, Boolean, String, RegExp, Function...

### 来一道容易错的小题

1.大家都知道 typeof null 输出 Object. 那么 null instanceof Object 呢?

```javascript
    console.log(typeof null);     //Object;
    console.log(null instanceof Object);    //false;
```

虽然 typeof null 输出 Object, 但 null 不是 Object 的是一个实例. null 是一个基本类型. 之所以 typeof null 输出 Object, 跟浏览器的实现有关.

## JS对象有哪几种创建方法

1.字面量方式:

> 这是最简单最基本的一种方法。

```javascript
    var obj = {};       //创建了一个空的对象
```

> 字面量方法有两种常用的形式。一种是简单字面量，像上面那样先创建一个空对象，然后再给这个对象加属性和函数。

```javascript
    var obj = {};
    obj.attr1 = 123;
    obj.attr2 = 'abc';
    obj.func1 = function(){...};
    obj.func2 = function(){...};
```

> 另一种是嵌入式字面量，像写JSON数据似的，直接在大括号中写属性和函数。

```javascript
    var obj = {
        attr1 : 123,
        attr2 : 'abc',
        func1 : function(){...},
        func2 : function(){...}
    };
```

2.简单的构造函数方式

> 通过new Person()这样的形式创建对象。用new这个关键字是为了讨好习惯了C++/Java的程序员的使用习惯。但也是JS的一大败笔（大牛都是这么说的，我只是有样学样）。

```javascript
    function Person(name,age){
        this.name = name;
        this.age = age;
    }
    var p1 = new Person('Peter',20);
    var p2 = new Person('Jack',21);
```

3.原型方式

```javascript
    function Person(){}
    Person.prototype.say = function(){...};
    var p1 = new Person();
    var p2 = new Person();
```

> 跟简单的构造函数形式不同的是，绑在this上的name/age是p1/p2对象独占的（私有的），而绑在prototype上的say方法是p1/p2对象共享的（公有的）。

4.构造函数+原型

> 有的人把这种方式称为“混合模式”，其实不是什么独特的模式，而是因为单纯地使用构造函数和单纯地使用原型方式都是不合适的。试想一下，类的概念就是希望属于这个类的对象有着相同名称的属性和方法，但属性是私有的，方法是共享的，你叫什么名字，几岁，是你这对象私有的属性，但说话这动作是大家都一样，只是内容不一样而已，所有方法应该共享的。
结合上面的简单构造函数和原型，一个完整的构造函数应该是这样的：

```javascript
    function Person(name,age){
        this.name = name;
        this.age = age;
    }
    Person.prototype.say = function(){
        console.log("My name is "+this.name+". I'm "+this.age+" years old.");
    }

    var p1 = new Person('Peter',20);
    var p2 = new Person('Jack',21);
```

## JS对象的相关知识点

1.创建一个对象

```javascript
    function Person(name, age) {
        this.name = name;
        this.age = age;
        this.sing = function() { alert(this.name) } 
    } 
```

2.谈谈This对象的理解。

this是js的一个关键字，随着函数使用场合不同，this的值会发生变化。
但是总有一个原则，那就是this永远指向调用函数所在的对象。
this一般情况下：是全局对象Global。 作为方法调用，那么this就是指这个对象

3.事件、IE与火狐的事件机制有什么区别？ 如何阻止冒泡？

我们在网页中的某个操作（有的操作对应多个事件）。例如：当我们点击一个按钮就会产生一个事件。是可以被 JavaScript 侦测到的行为。
事件处理机制：IE是事件冒泡、火狐是 事件捕获；
ev.stopPropagation();

4.什么是闭包（closure），为什么要用？

![闭包的理解](http://hj624608494.github.io/2016/02/28/bibao/)

5.如何判断一个对象是否属于某个类？

```javascript
    if(a instanceof Person){
       alert('yes');
   }
```
![更多内容](http://hj624608494.github.io/2016/02/28/typeof-instanceof/)

6.new操作符具体干了什么呢?

* 1、创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
* 2、属性和方法被加入到 this 引用的对象中。
* 3、新创建的对象由 this 所引用，并且最后隐式的返回 this 。

```javascript
    var obj  = {};
    obj.__proto__ = Base.prototype;
    Base.call(obj); 
```

7.JSON 的了解

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。它是基于JavaScript的一个子集。数据格式简单, 易于读写, 占用带宽小
{'age':'12', 'name':'back'}

8.js延迟加载的方式有哪些

defer和async、动态创建DOM方式（用得最多）、按需异步载入js

9.ajax 是什么?ajax 的交互模型?同步和异步的区别?如何解决跨域问题?

### ajax的优点

* 1.通过异步模式，提升了用户体验
* 2.优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用
* 3.Ajax在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。
* 4.Ajax的最大的特点是什么。
** Ajax可以实现动态不刷新（局部刷新）
** readyState属性 状态 有5个可取值： 0=未初始化 ，1=正在加载 2=以加载，3=交互中，4=完成

### ajax的缺点

* 1、ajax不支持浏览器back按钮。
* 2、安全问题 AJAX暴露了与服务器交互的细节。
* 3、对搜索引擎的支持比较弱。
* 4、破坏了程序的异常机制。
* 5、不容易调试。

10.模块化怎么做？

```javascript
    var module1 = (function(){
　　　　var _count = 0;
　　　　var m1 = function(){
　　　　　　//...
　　　　};
　　　　var m2 = function(){
　　　　　　//...
　　　　};
　　　　return {
　　　　　　m1 : m1,
　　　　　　m2 : m2
　　　　};
　　})();
```

11.对Node的优点和缺点提出了自己的看法：

（优点）因为Node是基于事件驱动和无阻塞的，所以非常适合处理并发请求，
因此构建在Node上的代理服务器相比其他技术实现（如Ruby）的服务器表现要好得多。
此外，与Node代理服务器交互的客户端代码是由javascript语言编写的，
因此客户端和服务器端都用同一种语言编写，这是非常美妙的事情。

（缺点）Node是一个相对新的开源项目，所以不太稳定，它总是一直在变，
而且缺少足够多的第三方库支持。看起来，就像是Ruby/Rails当年的样子。
