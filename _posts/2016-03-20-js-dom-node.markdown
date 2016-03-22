---
layout:     post
title:      "js DOM node的一些属性"
subtitle:   "js DOM node的一些属性"
date:       2016-03-20 13:00:00
author:     "hj"
header-img: "img/post-bg-2015.jpg"
tags:
    - dom节点
    - node
---

> node即为节点，一个属性可以是一个节点，一个< div>……< /div>也可以是一个节点，在< body>……< /body>中的，也是一个大大的节点。

#### Node的属性介绍：  
  
nodeType：显示节点的类型  
nodeName：显示节点的名称  
nodeValue：显示节点的值  
attributes：获取一个属性节点  
firstChild：表示某一节点的第一个节点  
lastChild：表示某一节点的最后一个子节点  
childNodes：表示所在节点的所有子节点  
parentNode：表示所在节点的父节点  
nextSibling：紧挨着当前节点的下一个节点  
previousSibling：紧挨着当前节点的上一个节点  

#### Node的方法介绍：  
  
hasChildNodes()：判定一个节点是否有子节点  
removeChild()：去除一个节点  
appendChild()：添加一个节点  
replaceChild()：替换一个节点  
insertBefore()：指定节点位置插入一个节点  
cloneNode()：复制一个节点  
normalize()：（不知）

hasChildNodes()方法：判定一个节点是否有子节点，有返回true，没有返回false  

```html
<div id="parent1"><p>ppp</p></div>
<div id="parent2"></div>

<script>
    console.log(document.getElementById('parent1').hasChildNodes());    // true
    console.log(document.getElementById('parent2').hasChildNodes());    // false
</script>
```

removeChild()方法：去除一个子节点  

```html
<div id="parent">
    <div id="node1">node1</div>
    <div id="node2">node2</div>
</div>

<script>
    var p = document.getElementById('parent');
    var c = document.getElementById('node1');
    p.removeChild(c);
</script>
```

appendChild()方法：添加一个子节点，如果文档树中已经存在该节点，则将它删除，然后在新位置插入。  

```html
<div id="parent3">
    <div id="node3">node1</div>
</div>

<script>
    var p = document.getElementById('parent3');
    var c = document.createElement('div');
    c.setAttribute('id', 'node4');
    c.innerHTML = 'node4';

    p.appendChild(c);
    console.log(c.getAttribute('id'));  //node4
</script>
```

replaceChild()方法：从文档树中删除（并返回）指定的子节点，用另一个节点来替换它。  

```html
<div id="parent4">
    <div id="node5">node1</div>
</div>

<script>
    var p = document.getElementById('parent4');
    var c = document.getElementById('node5');
    var n = document.createElement('div');
    n.setAttribute('id', 'node6');
    n.innerHTML = 'node6';

    p.replaceChild(n, c);
</script>
```

insertBefore()方法：在指定节点的前面插入一个节点，如果已经存在，则删除原来的，然后在新位置插入  

cloneNode()方法：复制一个节点，该方法有一个参数，true表示同时复制所有的子节点，false表示近复制当前节点  