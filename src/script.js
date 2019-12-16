const array = [1, 2, 3].map((item, index) => item * 2);
console.log(1);

const testArray = [1, 2, 3];
for (let element of testArray) {
  console.log(element);
}

const user = {
  firstName: "Sebastian",
  lastName: "McKenzie",
  getFullName: () => {
    // whoops! `this` doesn't actually reference `user` here
    return this.firstName + " " + this.lastName;
  },
  // use the method shorthand in objects
  getFullName2() {
    return this.firstName + " " + this.lastName;
  }
};
