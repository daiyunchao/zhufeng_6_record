function Animal(name) {
  if (!(this instanceof Animal)) {
    //如果this不是自己的实例,则说明没有实例化而是直接调用的 
    throw new Error('不能直接调用,必须使用实例调用')
  }

  //实例属性:
  this.name=name;
  this.age=10;
}

//公共属性
Animal.prototype.eat=function(){
console.log("in eat method");
}


let dog=new Animal('zhangsan');
console.log(dog.name);
dog.eat();

console.log(dog.__proto__===Animal.prototype);
console.log(dog.__proto__.constructor===Animal);
console.log(dog.__proto__.__proto__===Object.prototype);




