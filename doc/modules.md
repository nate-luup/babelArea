# babel各个模块介绍

- [babel-core](#babel-core)
- [babel-cli](#babel-cli)
- [babel-node](#babel-node)
- [babel-register](#babel-register)
- [babel-polyfill](#babel-polyfill)

<h2 id="babel-core">babel-core</h2>

- [babel.transform](#transform)
- [babel.transformFile](#transformFile)
- [babel.transformFileSync](#transformFileSync)
- [babel.transformFromAst](#transformFromAst)

[babel-core](http://babeljs.io/docs/usage/api/)是作为babel的核心存在，babel的核心api都在这个模块里面，比如：`transform`。

下面介绍几个babel-core中的api

<h3 id="transform">babel.transform：用于字符串转码得到AST</h3>

```js
/*
 * @param {string} code 要转译的代码字符串
 * @param {object} options 可选，配置项
 * @return {object} 
*/
babel.transform(code: string, options?: Object)

//返回一个对象(主要包括三个部分)：
{
    generated code, //生成码
    sources map, //源映射
    AST  //即abstract syntax tree，抽象语法树
}
```
一些使用babel插件的打包或构建工具都有使用到这个方法，下面是一些引入babel插件中的源码：

```js
//gulp-babel
const babel = require('babel-core');
/*
some codes...
*/
module.exports = function (opts) {
    opts = opts || {};
    return through.obj(function (file, enc, cb) {
        try {
            const fileOpts = Object.assign({}, opts, {
                filename: file.path,
                filenameRelative: file.relative,
                sourceMap: Boolean(file.sourceMap),
                sourceFileName: file.relative,
                sourceMapTarget: file.relative
            });
            const res = babel.transform(file.contents.toString(), fileOpts);
            if (res !== null) {
                //some codes
            }
        } catch (err) {
            //some codes
        }
    }
}

//babel-loader
var babel = require("babel-core");
/*
some codes...
*/
var transpile = function transpile(source, options) {
    //some code
    try {
        result = babel.transform(source, options);
    } catch (error) {
        //some codes
    }
    //some codes
}

//rollup-pugin-babel
import { buildExternalHelpers, transform } from 'babel-core';
/*
some codes...
*/
export default function babel ( options ) {
    //some codes
    return {
        // some methods
        transform ( code, id ) {
            const transformed = transform( code, localOpts );
            //some codes
            return {
                code: transformed.code,
                map: transformed.map
            };
        }
    }
}
```
上面是一些打包工具引入babel插件时的一些源码，可以看到基本都是先通过调用transform方法进行代码转码。

<h3 id="transformFile">babel.transformFile</h3>

```js
//异步的文件转码方式，回调函数中的result与transform返回的对象一至。
babel.transformFile("filename.js", options, function (err, result) {
  result; // => { code, map, ast }
});
```

<h3 id="transformFileSync">babel.transformFileSync</h3>

```js
//同步的文件转码方式，返回结果与transform返回的对象一至。
babel.transformFileSync(filename, options) // => { code, map, ast }
```
<h3 id="transformFromAst">babel.transformFromAst</h3>

```js
//将ast进行转译
const { code, map, ast } = babel.transformFromAst(ast, code, options);
```

<h2 id="babel-cli">babel-cli</h2>

[babel-cli](http://babeljs.io/docs/usage/cli/)是一个通过命令行对js文件进行换码的工具。

使用方法：
- 直接在命令行输出转译后的代码 

```bash
npx babel src/script.js 
```
- 指定输出文件 

```bash
npx babel src/script.js --out-file dist/build.js 
#或者是 
npx src/babel script.js -o dist/build.js 
```
让我们来编写了一个具有箭头函数的代码：

```js
//script.js
const array = [1,2,3].map((item, index) => item * 2);
```
然后在命令行执行 `babel src/script.js`，发现输出的代码好像没有转译。

因为我们没有告诉babel要转译哪些类型，现在看看怎么指定转译代码中的箭头函数。

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions

npx babel --plugins @babel/plugin-transform-arrow-functions src/script.js
```
转换结果
```js
const array = [1, 2, 3].map(function (item, index) {
  return item * 2;
});
```
或者在目录里添加一个`.babelrc`文件，内容如下：

```js
{
    "plugins": [
        "@babel/plugin-transform-arrow-functions"
    ]
}
```
`.babelrc`是babel的全局配置文件，所有的babel操作（包括`babel-core`、`babel-node`）基本都会来读取这个配置，后面会详细介绍。

<h2 id="babel-node">babel-node</h2>

安装

```bash
npm install --save-dev @babel/core @babel/node
```
在命令行输入`npx babel-node`会启动一个REPL（Read-Eval-Print-Loop），这是一个支持ES6的js执行环境。

babel-node还能直接用来执行js脚本，与直接使用node命令类似，只是会在执行过程中进行babel的转译，并且babel官方不建议在生产环境直接这样使用，因为babel实时编译产生的代码会缓存在内存中，导致内存占用过高，所以我们了解了解就好。

```bash
npx babel-node src/script.js
```
<h2 id="babel-register">babel-register</h2>

[babel-register](http://babeljs.io/docs/usage/babel-register/)字面意思能看出来，这是babel的一个注册器，它在底层改写了node的require方法，引入babel-register之后所有require并以.es6, .es, .jsx 和 .js为后缀的模块都会经过babel的转译。

安装
```bash
npm install @babel/core @babel/register --save-dev
node src/registerMain.js
```

<h2 id="babel-polyfill">babel-polyfill</h2>

polyfill这个单词翻译成中文是垫片的意思，详细点解释就是桌子的桌脚有一边矮一点，拿一个东西把桌子垫平。polyfill在代码中的作用主要是用已经存在的语法和api实现一些浏览器还没有实现的api，对浏览器的一些缺陷做一些修补。例如Array新增了includes方法，我想使用，但是低版本的浏览器上没有，我就得做兼容处理：

```js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
} 
```
上面简单的提供了一个includes方法的polyfill，代码来自MDN。

理解polyfill的意思之后，再来说说babel为什么存在polyfill。因为babel的转译只是语法层次的转译，例如箭头函数、解构赋值、class，对一些新增api以及全局函数（例如：Promise）无法进行转译，这个时候就需要在代码中引入babel-polyfill，让代码完美支持ES6+环境。前面介绍的babel-node就会自动在代码中引入babel-polyfill包。

安装
```bash
npm install --save @babel/polyfill

```
使用
```js
import "@babel/polyfill";
```
但很多时候我们并不会使用所有ES6+语法，全局添加所有垫片肯定会让我们的代码量上升，之后会介绍其他添加垫片的方式。

