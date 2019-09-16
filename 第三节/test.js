function Animal() {
  this.name = "zhangsan"
  this.age = 18;
}

Animal.prototype.say = function () {
  console.log("in say");
}

function mockNew(parent) {
  let obj = {};
  Animal.call(obj);
  obj.__proto__ = parent.prototype;
  return obj;
}

// let dog=new Animal();
let dog = mockNew(Animal);
console.log(dog.name);
console.log(dog.age);
dog.say();


