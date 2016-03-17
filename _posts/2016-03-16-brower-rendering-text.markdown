---
layout:     post
title:      "浏览器如何渲染文本"
subtitle:   "浏览器如何渲染文本"
date:       2016-03-016 12:00:00
author:     "hj"
header-img: "img/post-bg-2015.jpg"
tags:
    - 渲染引擎
    - 页面优化
---

> 浏览器是我们最常用的软件之一，文本又是网页中最主要的元素，在浏览器显示文本的过程中有许多有趣的细节，值得展开来讲讲，或许能减少一些误解。这 是一个比较粗略的，概括性的介绍，尽可能不涉及过多的技术细节和具体实现，而立足于给 Web 开发者和设计师提供一些正确的概念。

下面的介绍主要根据我对 WebKit 和 Gecko (Firefox) 的印象来谈，其他的浏览器也大致相同，如有阙漏之处欢迎指出。

当浏览器收到来自 Web 服务器的网页数据之后，第一步是要把它解码成可以阅读的文本，因为历史原因，不同区域和语言的网页可能会使用不同的编码方式，而浏览器判断编码主要是依据以下方法：

* 1.Web 服务器返回的 HTTP 头中的 Content-Type: text/html; charset= 信息，这一般有最高的优先级；
* 2.网页本身 meta header 中的 Content-Type 信息的 charset 部分，对于 HTTP 头未指定编码或者本地文件，一般是这么判断；
* 3.假如前两条都没有找到，浏览器菜单里一般允许用户强制指定编码；
* 4.部分浏览器 (比如 Firefox) 可以选择编码自动检测功能，使用基于统计的方法判断未定编码。

编码确定后，网页就被解码成了 Unicode 字符流，可以进行进一步的处理，比如 HTML 解析了，不过我们这里跳过 HTML/XML 解析的细节，单讲得到了解析后的文本元素之后该怎么处理。

因为我们得到的文本可能是很多种语言混杂的，里面可能有中文、有英文，它们可能要用不同的字体显示；也可能有阿拉伯文、希伯来文这种从右到左书写的 文字；也有可能涉及印度系文字这样涉及复杂布局规则的文字；另外，还可能有网页内自己指定的文本语言，比如 <span lang=”jp”>日本语</span> 这样的标记，使得日文汉字可以使用日文字体显示 (因为 Han Unification 导致这些汉字和中文里的汉字使用同样的代码点，尽管很多写法不同)，”lang” 属性也可以在 HTTP 头、<meta> 或者 <html> 出现，用于标记整个文档的全局语言，通常这是一种好的习惯，方便浏览器进行字体匹配。

为了统一处理所有这些复杂的情况，我们要将文本分为由不同语言组成的小段，在有的文本布局引擎里，这个步骤称为“itemize”，分解后的文本段 常被称作“text run”，但是具体划分的规则可能根据不同的引擎有所区别，比如 HarfBuzz 和 ICU 一般是根据要使用的不同排版类来划分 (常称作“shaper”)，比如英语和法语可能使用同一个 shaper 排版，那么相邻的英语和法语文本就会划分到同一个 run 里，而希伯来文需要另一个 shaper，就划分到它自己的 run 里，以 HarfBuzz 为例，它有这样一些 shaper：

* 通用的 (适用于中文、英文等等大多数布局规则简单的语言)
* 阿拉伯文
* 希伯来文
* ...

不少浏览器还会在这个划分下面，在确定具体使用的字体之后，根据使用字体的不同划分更细的 run，这种 run 可能称作“SimpleTextRun”，每个都会使用和相邻不同的字体，最后把它们逐一交给 shaper 进行排版得到要绘制的字形，这样一来，shaper 的工作就被简化为在确定的语言、确定的字体下排版确定的文本，生成对应的字形和它们应该放置的位置、占用的空间。下面先详细说说确定字体的步骤。

说到字体，首先必须提到的就是 CSS 里的 font 和 font-family 等规则。比如这样的规则：

```css
	p { font-family: Helvetica, Arial, sans-serif; } 
	strong { font-weight: bold; } 
```

如果对于这样一段文本：

```html
	<p>A quick brown fox <strong>jumps</strong> over the lazy dog.</p> 
```

表示这个段落里优先使用 Helvetica 这个 family 的字体，如果找不到，就找 Arial，如果还是找不到，就用浏览器设置的默认非衬线字体 (有的浏览器，比如 Safari 只给你一个设置，有的像 Firefox 则允许根据不同语言设置，这时可以根据前面分析得到的文本 run 语言信息来判断该用哪个)，这个过程非常简单，大家都很好理解。稍微复杂一点的是“jumps”，它应该继承父元素的 font-family，也用 Helvetica，但不用默认的 Regular，而用 Bold 版本，假如找不到 Helvetica Bold，就找 Arial Bold，否则就找浏览器设置的那个字体的 Bold 版本，假如都没有呢？就要考虑用人工伪造的方式来显示粗体了，这个且按下不谈，先看对于中文常见的情况：CSS 指定的字体没有覆盖我们需要的文本时，该怎么做。比如还是上面的 CSS 规则，但对这样的文本：

```html
	<p>一只敏捷的狐狸…</p> 
```

这里的“一只敏捷的狐狸”该用什么字体呢？假设 CSS 里具体指定了中文字体，比如 Helvetica, STHeiti, sans-serif，那很简单，按照英文字体一样的规则来判断：逐个字符尝试当前的字体是否提供了针对该字符的字形，如果没有则尝试下一个，要是到了最 后都没找到匹配的字体呢？CSS 规范里只简单的说执行“system font fallback”，但这个过程在不同的浏览器下可能很不一样，比如 WebKit 会使用 font-family 列表里的第一个字体和这段文本所属的语言来寻找 fallback 字体，像 Times 这样的 serif 字体对应的中文 fallback 字体，在 Mac OS X 下是华文宋体 (STSong)；而 Firefox 则会根据 sans-serif 这样的通用 font family 和对应的语言匹配到设置中针对对应语言的默认字体，比如在 Mac OS X 默认的中文非衬线字体是华文黑体 (STHeiti)。Linux 下一般通过 fontconfig 去根据语言、风格等参数来选择 fallback，但不同浏览器的实现还可能有区别；Windows 下则一般会使用系统的 Font Linking 机制，根据注册表内的 FontSubstitutes 信息来寻找。因为在这里不同的浏览器可能有不同的行为，所以建议在 CSS 中写明对应平台该用的字体。

具体的字体选择还有一些不太容易注意的细节，也是各个浏览器差异比较大的一点，可能会出现这样一些问题：

是否支持用字体的 PostScript name 选择：如 STHeiti 的 Light 版本又称作 STXihei，或者是否能用 full name 选择：有的浏览器不能正确地将 CSS 里对字体的 font-weight 或者 font-style 等要求映射到特定的字体上，尤其是在字体使用了非标准的 style 命名的情况下，考虑到很多厂商有自己的字体命名规则，这其实很容易出现，像 Helvetica Neue 的 UltraLight, Light, Regular, Medium, Bold 这些不同的 weight，是怎么对应到 CSS font-weight 的 100 到 900 数值上的？这就是特别容易出现 bug 的地方。

是否支持按 localized name 选择：比如能不能用 “宋体” 来代表 “SimSun”。以 Mac OS X 下的浏览器为例，Firefox 支持这样的写法，但基于 WebKit 的浏览器一般不支持，这样的问题 CSS 规范没有限定，所以无论哪种情况都是允许的。

总的说来，如果要保证最大限度的兼容性，在 CSS 书写的时候应该尽可能选择明确、不容易出错的写法，尽量少隐式地让浏览器自己确定 (be explict instead of implict)，虽然隐式写法通常比较简洁，但除非你 100% 确定想支持的浏览器在你想支持的平台下都能支持这个写法，否则还是不应该轻易用。

CSS3 新增的 @font-face 规则则是对于现有规则的扩展，提供了 web fonts 功能，但字体匹配算法的逻辑并没有改变，详细的算法可以看 CSS 规范里的说明。

当确定了字体以后，就可以将文本、字体等等参数一起交给具体的排版引擎，生成字形和位置，然后根据不同的平台调用不同的字体 rasterizer 将字形转换成最后显示在屏幕上的图案，一般浏览器都会选择平台原生的 rasterizer，比如 Mac OS X 下用 Core Graphics，Linux/X11 下用 FreeType，Windows 下用 GDI/DirectWrite 等等。关于这个步骤，typekit 的这篇 blog 可以作为参考。各个浏览器的差异主要来自使用的排版引擎可能对不同的语言支持有差异，调用 rasterizer 使用的参数可能有差异 (比如是否启用 subpixel rendering、使用的 hinting 级别等等)，但在同一个操作系统下的效果差别不会很大。

> 基于以上的介绍，可以尝试提出一个在现有浏览器下，针对中文用户的，书写 CSS 字体选择规则的建议，如下：

* 1.首先确定要选择字体的元素应该使用的字体风格，比如是衬线字体、非衬线字体还是 cursive、fantasy 之类的；
* 2.确定了风格之后，先选择西文字体，优先把平台独特的、在该平台下效果更好的字体写上，比如 Mac OS X 下有 Helvetica 也有 Arial，但 Helvetica (可能) 效果更好，Windows 下则一般只有 Arial，那么写 Helvetica, Arial 就比 Arial, Helvetica 或者只有 Arial 更好；
* 3.然后列出中文字体，原则相同，多个平台共有的字体应该尽量放在后边，独有的字体放在前面，还需要照顾到 Mac OS X/Linux 下一般用户习惯用(细)黑体作为默认字体，Windows 下习惯以宋体作为默认字体的情况，比如 STXihei, SimSun 这样的写法比较常见，如果写作 SimSun, STXihei，但 Mac OS X 上装了 SimSun 效果就不会太好看。
* 4.最后还是应该放上对应的 generic family，比如 sans-serif 或者 serif。
* 5.尽量用字体的基本名称 (比如 English locale 下显示的)，而不要用本地化过的名称。除非特殊情况 (Windows 下“某些”浏览器在特定编码下只能支持本地化的字体名称)。Mac OS X 下字体名称可以用 Font Book 查到 (菜单 Preview -> Show Font Info)，Windows 下字体信息在微软的网站可以得到，Linux/X11 下可以使用 fc-list 命令查到。
* 6.字体名称中包含空格时记住用引号扩起，比如 “American Typewritter” 和 “Myriad Pro”。
* 7.文档开头最好指明语言，比如 <html lang=”zh-CN”>，可以使用的语言标记参见 W3C 的说明。
