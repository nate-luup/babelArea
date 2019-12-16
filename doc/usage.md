# [使用指南](https://www.babeljs.cn/docs/usage)

## 概览
本指南将想你展示如何将 ES2015+ 语法的 JavaScript 代码编译为能在当前浏览器上工作的代码。这将涉及到新语法的转换和缺失特性的修补。

整个配置过程包括：

1. 运行以下命令安装所需的包（package）：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

2. 在项目的根目录下创建一个命名为 `babel.config.js` 的配置文件，其内容为：

```js
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
```

3. 运行此命令将 `src` 目录下的所有代码编译到 `lib` 目录：

```bash
npx babel src --out-dir dist
```

## CLI 命令行的基本用法

### 核心库

Babel 的核心功能包含在 `@babel/core` 模块中。

你可以在 JavaScript 程序中直接 `require` 并使用它：

```js
const babel = require("@babel/core");

babel.transform("code", optionsObject);
```

### CLI 命令行工具

`@babel/cli` 是一个能够从终端（命令行）使用的工具。下面是其安装命令和基本用法：

```bash
npm install --save-dev @babel/core @babel/cli

npx babel src --out-dir dist
```
这将解析 `src` 目录下的所有 JavaScript 文件，并应用我们所指定的代码转换功能，然后把每个文件输出到 `lib` 目录下。由于我们还没有指定任何代码转换功能，所以输出的代码将与输入的代码相同（不保留原代码格式）。我们可以将我们所需要的代码转换功能作为参数传递进去。


上面的示例中我们使用了` --out-dir `参数。你可以通过 `--help` 参数来查看命令行工具所能接受的所有参数列表。但是现在对我们来说最重要的是 `--plugins` 和 `--presets` 这两个参数。

## 插件和预设（preset）

代码转换功能以插件的形式出现，插件是小型的 JavaScript 程序，用于指导 Babel 如何对代码进行转换。你甚至可以编写自己的插件将你所需要的任何代码转换功能应用到你的代码上。例如将 ES2015+ 语法转换为 ES5 语法，我们可以使用诸如 `@babel/plugin-transform-arrow-functions` 之类的官方插件：

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions

npx babel src --out-dir dist --plugins=@babel/plugin-transform-arrow-functions
```

现在，我们代码中的所有箭头函数（`arrow functions`）都将被转换为 ES5 兼容的函数表达式了：

```js
const fn = () => 1;

// converted to

var fn = function fn() {
  return 1;
};
```

这是个好的开始！但是我们的代码中仍然残留了其他 ES2015+ 的特性，我们希望对它们也进行转换。我们不需要一个接一个地添加所有需要的插件，我们可以使用一个 "`preset`" （即一组预先设定的插件）

就像插件一样，你也可以根据自己所需要的插件组合创建一个自己的 `preset` 并将其分享出去。对于当前的用例而言，我们可以使用一个名称为 `env` 的 `preset`。

```bash
npm install --save-dev @babel/preset-env

npx babel src --out-dir dist --presets=@babel/env
```

如果不进行任何配置，上述 `preset` 所包含的插件将支持所有最新的 JavaScript （ES2015、ES2016 等）特性。但是 `preset` 也是支持参数的。我们来看看另一种传递参数的方法：配置文件，而不是通过终端控制台同时传递 `cli` 和 `preset` 的参数。

## 配置

现在，我们首先创建一个名为 `babel.config.js` 的文件，并包含如下内容：

```js
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
    },
  ],
];

module.exports = { presets };
```

```bash
npx babel src --out-dir dist --config-file ./babel.config.js
```

现在，名为 `env` 的 `preset` 只会为目标浏览器中没有的功能加载转换插件。语法都已经清楚了，接下来我们看看 polyfills 。


## Polyfill

`@babel/polyfill` 模块包括 `core-js` 和一个自定义的 `regenerator runtime` 模块用于模拟完整的 ES2015+ 环境。

这意味着你可以使用诸如 `Promise` 和 `WeakMap` 之类的新的内置组件、 `Array.from` 或 `Object.assign` 之类的静态方法、 `Array.prototype.includes` 之类的实例方法以及生成器函数（`generator functions`）（前提是你使用了 `regenerator` 插件）。为了添加这些功能，polyfill 将添加到全局范围（global scope）和类似 String 这样的内置原型（native prototypes）中。


对于软件库/工具的作者来说，这可能太多了。如果你不需要类似 `Array.prototype.includes` 的实例方法，可以使用 `transform runtime` 插件而不是对全局范围（global scope）造成污染的` @babel/polyfill`。

更进一步，如哦你确切地知道你所需要的 polyfills 功能，你可以直接从 `core-js` 获取它们。

由于我们构建的是一个应用程序，因此我们只需安装 `@babel/polyfill` 即可：

```bash
npm install --save @babel/polyfill

```
> 注意，使用 `--save` 参数而不是 `--save-dev`，因为这是一个需要在你的源码之前运行的 `polyfill`。


幸运的是，我们所使用的 `env` preset 提供了一个 "`useBuiltIns`" 参数，当此参数设置为 "`usage`" 时，就会加载上面所提到的最后一个优化措施，也就是只包含你所需要的 polyfill。使用此新参数后，修改配置如下：

```js
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
```

Babel 将检查你的所有代码，以便查找目标环境中缺失的功能，然后只把必须的 polyfill 包含进来。示例代码如下：

```js
Promise.resolve().finally();
```

将被转换为（由于 Edge 17 没有 `Promise.prototype.finally`）：

```js
require("core-js/modules/es.promise.finally");

Promise.resolve().finally();
```

如果我们不使用 `env` preset 的 "`useBuiltIns`" 参数（即设置为 "`usage`"），那么我们必须在所有代码之前通过 `require` 加载一次完整的 `polyfill`。

## 总结

我们使用 `@babel/cli` 从终端运行 Babel，
利用 `@babel/polyfill` 来模拟所有新的 JavaScript 功能，
而 `env` preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 `polyfill`。
