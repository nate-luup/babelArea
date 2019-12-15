# babelArea

- [简介](#introduce)
- [使用指南](doc/usage.md)
- [版本变更](doc/version-history.md)
- [模块介绍](doc/modules.md)
- [配置](doc/configration.md)
- [参考地址](#reference)

<h2 id="introduce">简介</h2>

说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的官网是这样介绍它的：

> Babel is a JavaScript compiler.
  Use next generation JavaScript, today.

大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对 `js` 语法的支持不尽相同，特别是ES6之后，ECMAScrip对版本的更新已经到了一年一次的节奏，虽然每年更新的幅度不大，但是每年的提案可不少。

babel的出现就是为了解决这个问题，把那些使用新标准编写的代码转译为当前环境可运行的代码，简单点说就是把ES6代码转译（转码+编译）到ES5。


经常有人在使用`babel`的时候并没有弄懂`babel`是干嘛的，只知道要写ES6就要在webpack中引入一个`babel-loader`，然后胡乱在网上copy一个`.babelrc`到项目目录就开始了. 理解babel的配置很重要，可以避免一些不必要的坑，比如：代码中使用`Object.assign`在一些低版本浏览器会报错，以为是webpack打包时出现了什么问题，其实是`babel`的配置问题。


<h2 id="reference">参考地址</h2>

- [babeljs](https://babeljs.io/)
- [babel 中文](https://www.babeljs.cn/)
- [babel到底该如何配置？](https://blog.csdn.net/qq_16339527/article/details/79253865)
- [babel github](https://github.com/babel/babel/tree/master/packages)
