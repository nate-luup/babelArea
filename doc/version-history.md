# Babel的版本变更

- [babel5](#babel5) 
- [babel6](#babel6) 
- [babel7](#babel7)
    - 断崖式变更
    - babel-upgrade
    - JavaScript 配置文件
    - 速度
    - 语法
        - 支持 TC39 Proposals
        - 支持 TypeScript（@babel/preset-typescript）
        - 支持 JSX Fragment（）
    - Babel Helpers 改动的地方
    - 自动 polyfill（实验性质）

    
- [参考地址](#reference)

<h2 id="babel5">babel5</h2>

babel5属于全家桶型，只要安装babel就会安装babel相关的所有工具， 即装即用

<h2 id="babel6">babel6</h2>

- 移除babel全家桶安装，拆分为单独模块，例如：
    - babel-core
    - babel-cli
    - babel-node
    - babel-polyfill
- 新增 `.babelrc` 配置文件，基本上所有的`babel`转译都会来读取这个配置；
- 新增 `plugin` 配置，所有的东西都插件化，什么代码要转译都能在插件中自由配置；
- 新增 `preset` 配置，babel5会默认转译ES6和jsx语法，babel6转译的语法都要在`perset中`配置，`preset`简单说就是一系列`plugin`包的使用。

<h2 id="babel7">babel7</h2>

### 断崖式变更
- 对那些已经不维护的 node 版本不予支持，包括 0.10、0.12、4、5（[详情](http://babeljs.io/blog/2017/09/12/planning-for-7.0#drop-support-for-unmaintained-node-versions-010-012-5-4315-https-githubcom-babel-babel-issues-4315)）
- Babel 团队会通过使用 “scoped” packages 的方式，来给自己的 babel package name 加上 @babel 命名空间（[详情](http://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#renames-scoped-packages-babel-x)），这样以便于区分官方 package 以及 非官方 package，所以 `babel-core` 会变成 `@babel/core`
- 移除（并且停止发布）所有与 *yearly* 有关的 presets（`preset-es2015` 等）（[详情](http://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#deprecated-yearly-presets-eg-babel-preset-es20xx)）。`@babel/preset-env` 会取代这些 `presets`，这是因为 `@babel/preset-env` 囊括了所有 *yearly* `presets` 的功能，而且 `@babel/preset-env` 还具备了针对特定浏览器进行“因材施教”的能力
- 放弃 `Stage` presets（`@babel/preset-stage-0` 等），选择支持单个 proposal。相似的地方还有，会默认移除 `@babel/polyfill` 对 proposals 支持（[详情](https://github.com/babel/babel/pull/8440)）。想知道更多相关的细节，可以考虑阅读整篇[博文](https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets)
- 有些 package 已经换名字：所有 TC39 proposal plugin 的名字都已经变成以 `@babel/plugin-proposal` 开头，替换之前的 `@babel/plugin-transform`（[详情](http://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#renames-proposal)）。所以 `@babel/plugin-transform-class-properties` 变成 `@babel/plugin-proposal-class-properties`
- 针对一些用户会手动安装（user-facing）的 package（例如 babel-loader，@babel/cli 等），会给 `@babel/core` 加上 `peerDependency`（[详情](http://babeljs.io/blog/2017/12/27/nearing-the-7.0-release#peer-dependencies-integrations)）

### babel-upgrade
[babel-upgrade](https://github.com/babel/babel-upgrade)，Babel 团队开发的新工具，旨在用来处理升级过程中的琐事（changes）：目前只是针对 `package.json` 的 `dependencies` 以及 `.babelrc`配置。

Babel 团队推荐在 git 项目里面直接运行 `npx babel-upgrade`，或者你可以通过 `npm install -g babel-upgrade` 的方式，在全局安装 `babel-upgrade`。

如果你想修改文件，你可以传 `--write` 以及 `--install`。

```bash
npx babel-upgrade --write --install
```

### JavaScript 配置文件

Babel 7 正在引入 `babel.config.js`。注意：使用 `babel.config.js` 并不是一个必要条件，或者也可以这样说，`babel.config.js` 甚至不是 `.babelrc` 的替代品，不过在一些特定的场景下，使用 `babel.config.js` 还是有帮助的。

用 `*.js` 来做配置文件的做法，在 JavaScript 的生态里面已经相当常见。ESlint 和 Webpack 都已经考虑到用 `.eslintrc.js` 以及 `webpack.config.js` 来做配置文件。

下面说的就是这个例子 —— 只会在“生产”环境中使用 `babel-plugin-that-is-cool` 插件来编译（当然，你也可以在 `.babelrc` 配置文件，通过配置 `env` 配置项的方式来做这件事）：

```js
var env = process.env.NODE_ENV;
module.exports = {
  plugins: [
    env === "production" && "babel-plugin-that-is-cool"
  ].filter(Boolean)
};
```
与 `.babelrc` 相比，针对查找配置文件的这件事，Babel 对 `babel.config.js` 有着不同的解决方案。Babel 总是会从 `babel.config.js` 来获取配置内容，与之相对的是，Babel 会针对每个文件都做一次向上查找的操作，直至找到配置文件为止。这使得 `babel.config.js` 新特性 **overrides** （下文将会提到）的使用变成了可能。

### 使用 overrides，实现配置有选择性的“表达”

```js
module.exports = {
  presets: [
    // defeault config...
  ],
  overrides: [{
    test: ["./node_modules"],
    presets: [
      // config for node_modules
    ],
  }, {
    test: ["./tests"],
    presets: [
      // config for tests
    ],
  }]
};
```
这样就实现在一个项目当中，可以针对测试代码、客户端代码以及服务端代码使用不同的编译配置（compilation configs），就很好的避免了需要你为每个文件夹都创建一个新的 `.babelrc` 配置文件的情况。

## 速度

Babel 团队认为，Babel 本身运行的速度就[很快](https://twitter.com/left_pad/status/927554660508028929)，所以 Babel 应该花更少的时间在构建上！为了优化代码，Babel 团队做了很多改变，也[接受](https://twitter.com/bmeurer/status/924346958810107904)了来自 [v8](https://twitter.com/v8js) 团队的[补丁](https://twitter.com/rauchg/status/924349334346276864)。

## 语法

### 支持 TC39 Proposals

### 支持 TypeScript（@babel/preset-typescript）

使用 `@babel/preset-typescript` ，可以让 Babel 解析/转换 typescript 的 type 语法，同样的事情还有，使用 `@babel/preset-flow` 可以让 Babel 处理 `flow`。
> 获取更多详情，可以去看 TypeScript team 写的这篇[博文](https://blogs.msdn.microsoft.com/typescript/2018/08/27/typescript-and-babel-7/)

### 支持 JSX Fragment（）

## Babel Helpers 改动的地方

之前的 `@babel/runtime` 已经被分成 `@babel/runtime` 以及 `@babel/runtime-corejs2`（PR）。前者只保留了 Babel helper 函数，后者保留了 polyfill 函数（例如，Symbol，Promise）。
