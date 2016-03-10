---
layout:     post
title:      "前端面试案例"
subtitle:   "前端面试案例"
date:       2016-03-09 12:00:00
author:     "hj"
header-img: "img/post-bg-2015.jpg"
tags:
    - prototype
    - arguments
    - apply和call
---

来源：![慕课文章](http://www.imooc.com/article/4379)

> 注：之前我们介绍过：一名靠谱的JavaScript程序员应备的素质，从程序员的角度提出要去学习哪些知识，下面这篇文章从面试官的角度介绍到面试时可能会问到的一些问题。

我在Twitter和Stripe的一部分工作内容是面试前端工程师。其实关于面试你可能很有自己的一套，这里我想跟你们分享一下我常用的方法。

不过我想先给你们一个忠告，招聘是一件非常艰巨的任务，在45分钟内指出一名侯选人是否合适是你需要完成的任务。不过面试的最大问题是每个人都会想着去雇佣他们自己，任何通过我面试的人想法大都跟我差不多（注：因为你总会问你自己关心和知道的问题），这其实不是一件好事。因此我之前的决定都有很大碰运气的成分。不过，这也是一个良好的开端。

最理想的情况下是侯选人有一个全面的Github“简历”，这样我们可以同时通过他们的开源项目了解他们。我经常会浏览他们的代码然后针对一些特定的代码设计问一些问题。如果侯选人有非常好的开源项目记录，接下来的面试会直接去检验他们的团队协作精神。否则，我不得不去问他们一些代码方面的问题了。

我的面试非常有实践性，全部是写代码。没有抽象和理论上的东西（注：作者是个行业派），其他的面试官很可能会问这些问题，但是我认为他们前端编程的能力是值得商榷的。我问的问题大多看上去非常简单，但是每组问题都能让我考查侯选人某一方面JavaScript的知识。

## 第一部分：Object Prototypes (对象原型)

刚开始很简单。我会让侯选人去定义一个方法，传入一个string类型的参数，然后将string的每个字符间加个空格返回，例如：

```javascript
spacify('hello world') // => 'h e l l o  w o r l d'
```

尽管这个问题似乎非常简单，其实这是一个很好的开始，尤其是对于那些未经过电话面试的侯选人——他们很多人声称精通JavaScript，但通常连一个简单的方法都不会写。

下面是正确答案，有时侯选人可能会用一个循环，这也是一种可接受的答案。

```javascript
function spacify(str) {
  return str.split('').join(' ');
}
```

接下来，我会问侯选人，如何把这个方法放入String对象上面，例如：

```javascript
'hello world'.spacify();
```

问这个问题可以让我考察侯选人是否对function prototypes(方法原型)有一个基本的理解。这个问题会经常引起一些有意思的讨论：直接在对象的原型（prototypes）上添加方法是否安全，尤其是在Object对象上。最后的答案可能会像这样：

```javascript
String.prototype.spacify = function(){
  return this.split('').join(' ');
};
```

到这儿，我通常会让侯选人解释一下函数声明和函数表达式的区别。

```javascript
//函数声明
function f(){

}

//函数表达式
var f = function(){

}
```

js的解析器对函数声明与函数表达式并不是一视同仁地对待的。对于函数声明，js解析器会优先读取，确保在所有代码执行之前声明已经被解析，而函数表达式，如同定义其它基本类型的变量一样，只在执行到某一句时也会对其进行解析，所以在实际中，它们还是会有差异的，具体表现在，当使用函数声明的形式来定义函数时，可将调用语句写在函数声明之前，而后者，这样做的话会报错。

```javascript
//调用函数a
a('test');  // test 正常输出;

//函数声明
function a(str){
    console.log(str);
}

//调用函数b
b('test');  // Uncaught TypeError: b is not a function(…)

//函数表达式
var b = function(){
    console.log(b + 'hello');
}
```

## 第二部分：参数 arguments

下一步我会问一些简单的问题去考察侯选人是否理解参数（arguments）对象。我会让他们定义一个未定义的log方法作为开始。

```javascript
log('hello world')
```

我会让侯选人去定义log，然后它可以代理console.log的方法。正确的答案是下面几行代码，其实更好的侯选人会直接使用apply.

```javascript
function log(msg)　{
    console.log(msg);
}
```

他们一旦写好了，我就会说我要改变我调用log的方式，传入多个参数。我会强调我传入参数的个数是不定的，可不止两个。这里我举了一个传两个参数的例子。

```javascript
log('hello', 'world');
```

希望你的侯选人可以直接使用apply。有时人他们可能会把apply和call搞混了，不过你可以提醒他们让他们微调一下。传入console的上下文也非常重要。

```javascript
function log(){
    console.log.apply(console, arguments);
};
```

接下来我会让侯选人给每一个log消息添加一个"(app)"的前辍，比如：

```javascript
'(app) hello world'
```

现在可能有点麻烦了。好的侯选人知道arugments是一个伪数组，然后会将他转化成为标准数组。通常方法是使用Array.prototype.slice，像这样：

```javascript
function log(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('(app)');

    console.log.apply(console, args);
};
```