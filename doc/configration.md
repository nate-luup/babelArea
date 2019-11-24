# 配置

- .babelrc
- plugins
- presets

## .babelrc

前面已经介绍了babel常用的一些模块，接下来看看babel的配置文件 `.babelrc`。

后面的后缀`rc`来自linux中，使用过linux就知道linux中很多`rc`结尾的文件，比如`.bashrc`，`rc`是run command的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。

babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从`package.json`文件的`babel`属性中读取配置。


## plugins


先简单介绍下 plugins ，babel中的插件，通过配置不同的插件才能告诉babel，我们的代码中有哪些是需要转译的。

这里有一个babel官网的[插件列表](http://babeljs.io/docs/plugins/)，里面有目前babel支持的全部插件。

```json
{
    "plugins": [
        "transform-es2015-arrow-functions", //转译箭头函数
        "transform-es2015-classes", //转译class语法
        "transform-es2015-spread", //转译数组解构
        "transform-es2015-for-of" //转译for-of
    ]
}
//如果要为某个插件添加配置项，按如下写法：
{
    "plugins":[
        //改为数组，第二个元素为配置项
        ["transform-es2015-arrow-functions", { "spec": true }]
    ]
}
```
上面这些都只是语法层次的转译，前面说过有些api层次的东西需要引入`polyfill`，同样babel也有一系列插件来支持这些。

```js
{
    "plugins":[
        //如果我们在代码中使用Object.assign方法，就用如下插件
        "transform-object-assign"
    ]
}

//写了一个使用Object.assign的代码如下：
const people = Object.assign({}, {
    name: 'shenfq'
});
//经过babel转译后如下：
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const people = _extends({}, {
    name: 'shenfq'
});
```
这种通过transform添加的polyfill只会引入到当前模块中，试想实际开发中存在多个模块使用同一个api，每个模块都引入相同的polyfill，大量重复的代码出现在项目中，这肯定是一种灾难。另外一个个的引入需要polyfill的transform挺麻烦的，而且不能保证手动引入的transform一定正确，等会会提供一个解决方案：`transform-runtime`。

除了添加polyfill，babel还有一个工具包helpers，如果你有安装babel-cli，你可以直接通过下面的命令把这个工具包输出：

```bash
./node_modules/.bin/babel-external-helpers > helpers.js
```

这个工具包类似于babel的utils模块，就像我们项目中的utils一样，很多地方都会用到，例如babel实现Object.assign就是使用的helpers中的_extend方法。为了避免同一个文件多次引用babel的助手函数，通过`external-helpers`插件，能够把这些助手函数抽出放到文件顶部，避免多次引用。

```json
//配置
{
  "plugins": ["external-helpers"]
}
```

虽然这个插件能避免一个文件多次引用助手函数，但是并不能直接避免多个文件内重复引用，这与前面说到的通过transform添加polyfill是一样的问题，这些引用都只是module级别的，在打包工具盛行的今天，需要考虑如何减少多个模块重复引用相同代码造成代码冗余。

当然也可以在每个需要使用helpers的js文件顶部直接引入之前生成的helpers文件既可，通过打包工具将这个公共模块进行抽离。

```js
require('helpers');
```

在说完babel的helpers之后就到了插件系统的最后的一个插件：`transform-runtime`。前面在`transform-polyfill`的时候也有提到这个插件，之所以把它放到helpers后面是因为这个插件能自动为项目引入`polyfill`和`helpers`。

```bash
npm install -D babel-plugin-transform-runtime babel-runtime
```

`transform-runtime`这个插件依赖于`babel-runtime`，所以安装`transform-runtime`的同时最好也安装`babel-runtime`，为了防止一些不必要的错误。`babel-runtime`由三个部分组成：

1. core-js
>    core-js极其强悍，通过ES3实现了大部分的ES5、6、7的垫片，作者zloirock是来自战斗名族的程序员，一个人维护着core-js，听说他最近还在找工作，上面是core-js的github地址，感兴趣可以去看看。 
    2. regenerator 
    regenerator来自facebook的一个库，用于实现 generator functions。 
    3. helpers 
    babel的一些工具函数，没错，这个helpers和前面使用babel-external-helpers生成的helpers是同一个东西

从babel-runtime的package.json文件中也能看出，runtime依赖了哪些东西。

安装有babel-runtime之后要引入helpers可以使用如下方式：

```js
require('babel-runtime/helpers');
```

使用runtime的时候还有一些配置项：

```js
{
    "plugins": [
        ["transform-runtime", {
            "helpers": false, //自动引入helpers
            "polyfill": false, //自动引入polyfill（core-js提供的polyfill）
            "regenerator": true, //自动引入regenerator
        }]
    ]
}
```

比较transform-runtime与babel-polyfill引入垫片的差异：

1. 使用runtime是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，不需要再手动一个个的去配置plugins，只是引入的polyfill不是全局性的，有些局限性。而且runtime引入的polyfill不会改写一些实例方法，比如Object和Array原型链上的方法，像前面提到的Array.protype.includes。

2. babel-polyfill就能解决runtime的那些问题，它的垫片是全局的，而且全能，基本上ES6中要用到的polyfill在babel-polyfill中都有，它提供了一个完整的ES6+的环境。babel官方建议只要不在意babel-polyfill的体积，最好进行全局引入，因为这是最稳妥的方式。

3. 一般的建议是开发一些框架或者库的时候使用不会污染全局作用域的babel-runtime，而开发web应用的时候可以全局引入babel-polyfill避免一些不必要的错误，而且大型web应用中全局引入babel-polyfill可能还会减少你打包后的文件体积（相比起各个模块引入重复的polyfill来说）。


## presets

显然这样一个一个配置插件会非常的麻烦，为了方便，babel为我们提供了一个配置项叫做persets（预设）。

预设就是一系列插件的集合，就好像修图一样，把上次修图的一些参数保存为一个预设，下次就能直接使用。

如果要转译ES6语法，只要按如下方式配置即可：

```js
/先安装ES6相关preset： cnpm install -D babel-preset-es2015
{
    "presets": ["es2015"]
}

//如果要转译的语法不止ES6，还有各个提案阶段的语法也想体验，可以按如下方式。
//安装需要的preset： cnpm install -D babel-preset-stage-0 babel-preset-stage-1 babel-preset-stage-2 babel-preset-stage-3
{
    "presets": [
        "es2015",
        "stage-0",
        "stage-1",
        "stage-2",
        "stage-3",
    ]
}

//同样babel也能直接转译jsx语法，通过引入react的预设
//cnpm install -D babel-preset-react
{
    "presets": [
        "es2015",
        "react"
    ]
}
```

不过上面这些preset官方现在都已经不推荐了，官方**唯一推荐**preset：babel-preset-env。

这款preset能灵活决定加载哪些插件和polyfill，不过还是得开发者手动进行一些配置。

```js
// cnpm install -D babel-preset -env
{
    "presets": [
        ["env", {
            "targets": { //指定要转译到哪个环境
                //浏览器环境
                "browsers": ["last 2 versions", "safari >= 7"],
                //node环境
                "node": "6.10", //"current"  使用当前版本的node

            },
             //是否将ES6的模块化语法转译成其他类型
             //参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
            "modules": 'commonjs',
            //是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本
            "debug": false,
            //强制开启某些模块，默认为[]
            "include": ["transform-es2015-arrow-functions"],
            //禁用某些模块，默认为[]
            "exclude": ["transform-es2015-for-of"],
            //是否自动引入polyfill，开启此选项必须保证已经安装了babel-polyfill
            //参数：Boolean，默认为false.
            "useBuiltIns": false
        }]
    ]
}
```
关于最后一个参数`useBuiltIns`，有两点必须要注意： 

1. 如果`useBuiltIns`为`true`，项目中必须引入`babel-polyfill`。 
2. `babel-polyfill`只能被引入一次，如果多次引入会造成全局作用域的冲突。

做了个实验，同样的代码，只是`.babelrc`配置中一个开启了`useBuiltIns`，一个没有，两个js文件体积相差70K。

最后啰嗦一句

关于polyfill还有个叫做[polyfill.io](https://polyfill.io/v2/docs/)的神器，只要在浏览器引入

```
https://cdn.polyfill.io/v2/polyfill.js
```

服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。

文章转自： https://blog.csdn.net/qq_16339527/article/details/79253865