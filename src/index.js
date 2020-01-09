/**
 * Examples from https://babeljs.io/docs/en/plugins
 */

/** ES2015 */
// transform-arrow-functions
const fn = () => {
  console.log("a");
};

//transform-block-scoped-functions
{
  function name(n) {
    return n;
  }
}

name("Steve");

// transform-block-scoping

{
  let a = 3;
}

let a = 3;

// transform-classes

class Test {
  constructor(name) {
    this.name = name;
  }

  logger() {
    console.log("Hello", this.name);
  }
}
// transform-for-of

for (var i of foo) {
}

/** ES2017 */

async function foo() {
  await bar();
}

/**ES2018 */
// async-generator-functions
async function* agf() {
  await 1;
  yield 2;
}

// object-rest-spread

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }
