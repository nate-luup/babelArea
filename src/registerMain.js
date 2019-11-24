//main.js
require('@babel/register');
var test = require('./registerTest');  //test.js中的es6语法将被转译成es5

console.log(test.toString()); //通过toString方法，看看控制台输出的函数是否被转译