function Animal() {
  this.type = '哺乳动物'
}
Animal.prototype.eat = function () {
  console.log("我在吃东西");
}

function create(parentPrototype) {
  function FN() {

  }
  FN.prototype = parentPrototype;
  return new FN();
}
function Dog(name) {
  this.name = name;
  Animal.call(this);

}
Dog.prototype = Object.create(Animal.prototype, { constructor: { value: Dog } });
let dog = new Dog('zhangsan');
console.log(dog.name);
console.log(dog.type);
dog.eat();



