### Es6 Class

```javascript

//这样的写法是 规范写法
class Animal {
  constructor(){
    this.name='name';
    this.type='type';
  }
}

//这种写法是es的实验性写法
//在Node环境中是不能运行的
//在webpack 需要插件的帮助转换@babel/plugin-proposal-class-properties
class Animal{
  type='type';
  name='name'
}
```

```javascript
class Animal{
  type="name";
  getName(){
    console.log(this)
  }
}

let getName=new Animal().getName;
getName();//undefined ES6的规范

//只能先绑定
let animal=new Animal();
let getName=animal.getName.bind(animal);
getName();
```

#### 如何将属性直接定义到原型上呢?
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName(){
    return name;
  }

  //将a属性保证成get方法
  get a() {
    return 1;
  }
}
let  animal=new Animal()
console.log(animal);

//发现: a属性不仅会出现在Animal.prototype上也会出现在Animal的实例属性上

```

#### 静态属性
静态属性是直接定义到类上的属性
注意点: static age=18(静态属性)语法是ES7的语法,不能直接在Node环境中使用 需要`webpack`的
`@babel/plugin-proposal-class-properties`转换
但是 static getAge(){} (静态方法)是ES6的语法,可以直接使用
```javascript

class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return name;
  }
  get a() {
    return 1;
  }

  static age = 18;
}
let animal = new Animal()
console.log(animal);//打印结果发现,并没有age属性
console.log(Animal.age);//18 在类中


//如果不想使用ES7的语法但也想直接使用静态属性,如何使用呢?

class Animal{
  constructor(name) {
    this.name = name;
  }
  getName() {
    return name;
  }

  static get age(){
    return 18
  }
}
```

#### ES6的继承
```javascript
class Animal{
  
}
class Dog extends Animal{

}

//静态方法也会被这类继承
class Animal{
  static flag=false;
}
class Dog extends Animail{
}

console.log(Dog.flag)//true

```

#### Super的用法
```javascript

//调用父类的钩子函数
class Animal{
  constructor(name){
    this.name=name;
  }
}
class Dog extends Animal{
  constructor(name){
    super(name);
  }
}

//super的纸袋问题?
// super是指父类

//主动调用父类的方法(原型方法)
class Animal{
  constructor(name){
    this.name=name;
  }

  getName(){
    console.log('parent getName')
  }
}
class Dog extends Animal{
  constructor(name){
    super(name);
  }

  getName(){
    console.log('son getName');
    super.getName();//super指定的是 Animal.prototype
  }
}
```

#### new的模拟
```javascript
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

```

#### 类的装饰器
```javascript

//可以修饰类 也可以修饰类的属性
@type1
@type2
class Animal{

}

//1.type1 和 type2 都是函数
//function type1(Constrtuctor){}
//2.它的意思是 声明了Animal类,并且调用 type函数
//3.调用顺序是 就近调用 先调用的是type2再调用type1
```
#### 装饰器的小例子:
```javascript
function type(typeName) {
  console.log(typeName);
  return function (Constructor) {
    Constructor.type=typeName;
    console.log("in type inter");
  }
}

function name(n) {
  console.log(n);
  return function (Constructor) {
    
    Constructor.name=n;
    console.log("in name inter");
  }
}
@type('哺乳类')
@name('张三')
class Animal {

}

let dog=new Animal();
console.log(dog);
console.log(Animal.name);

//执行顺序是 type函数 name 函数 再执行 name的 inter 和 type的inter
```

#### 使用装饰器装饰类的小例子:
```javascript

  //混合对象的属性和类
  let obj = {
    name: "zhangsan",
    age: 18
  }

  @mixin(obj)
  class Zhangsan {

  }

  function mixin(obj) {
    return function (Constrcutor) {
      Object.assign(Constrcutor.prototype, obj);
    }
  }

  console.log(new Zhangsan().name);

```

#### 使用装饰器装饰类的属性
```javascript
class Circle{
  @readonly type="circle"
}

//ClassPrototype: CirCle.prototype
//key: 要修饰的key
//descriptor: key的描述信息 configurable enumerable writable initializer
function readonly(ClassPrototype,key,descriptor){
  console.log(descriptor);
  //将该属性的writable设置为false,就不能被更改了
  descriptor.writable=false;
}
let circle=new Circle();
//尝试修改type的值
circle.type="1122"
//打印出来的结果依然是circle
console.log(circle.type);

```

#### 使用装饰器装饰类的方法
```javascript
  class Circle {
    @readonly type = "circle"
    @before getName() {
      console.log("getName");
    }
  }

  //ClassPrototype: CirCle.prototype
  //key: 要修饰的key
  //descriptor: key的描述信息 configurable enumerable writable initializer
  function readonly(ClassPrototype, key, descriptor) {
    console.log(descriptor);
    //将该属性的writable设置为false,就不能被更改了
    descriptor.writable = false;
  }

  function before(ClassPrototype, key, descriptor) {
    //在装饰函数中descriptor.value就是函数本身,就像例子中的"getName"
    let oldMethod = descriptor.value;
    descriptor.value = function () {
      console.log("in before method");
      oldMethod();

    }
  }
  let circle = new Circle();
  //尝试修改type的值
  circle.type = "1122"
  //打印出来的结果依然是circle
  console.log(circle.type);
  circle.getName();
```