### ES6的模块化 && Node的模块化

#### export let a=10 导出变量
```javascript
//导出两个变量 a 和 b
export let a=10;
export let b=10;

// 等于于
const a=10;
const b=20;
export {
  a,b
}
//导出的变量(接口)而不是值
//错误:
export {
  a:10,
  b:20
}

//导出时候修改别名
exoirt {
  a as c,b
}
//将a名称修改成c

//实例:

//a.js文件
let a=10;
let b=20;
setInterval(() => {
  a++
}, 1000);
export {
  a,b
}

//b.js
import {a,b} from './a';
setInterval(()=>{
  console.log(a)
},1000)

//b文件中的打印信息会改变吗
// 答应是会的 因为 export导出的是变量,而不是值,所以变量的值改变了再去取的值,会改变
//导入的 可以把它看成是一个接口,每次取的值其实是调用一个接口

```

> **import只能放到最外的作用域中**
> **并且import语法会被解析到页面的最顶部**
> **导入的变量不能更改它的值**


#### export default 默认导出
> 和`export default`的区别 `export`  导出的是一个变量(接口) `export default` 是导出的一个值
> 例如: 可以使用 `export default 'hello'` 但不能有 `export 123`;
`export default xx`的原理(不同,因为`export default`导出的是值,而`export导出的是变量`):
```javascript
let a=10;
let b=20;
let c=30;
export default c
export {
  a,b,
}
//等价于:

let a=10;
let b=20;
let c=30;

export {
  a,b,c as default
}

// 引用方式
import xxx from './a';

```
> 使用`import`导入全部的属性
```javascript
import * as obj from './a'
//这个时候 obj中就有了全部导入的属性了
```

> 如何接收默认导出的对象
```javascript
//文件a.js
export let a=10;
export let b=20;
export default 30;

//文件b.js
import c,{a,b} from './a.js';
```

> 合并导出

```javascript
export * from './a';
export * from './b';

```

> 副作用引用(文件会被执行,但引用的地方没用使用它)
```javascript
import './a.css'
import './a.js'

```

#### 动态导入
> 什么叫动态导入,当我代码执行到一个地方时,再去加载一个js文件
> 原理是 通过`webpack`自动拆分成一个新的文件,再用jsonp的方式引用
```javascript
let button=document.getElementById("btn")
btn.onclick=function(){
  //动态引入file.js文件,并且执行
  import('./file.js').then(data=>{
    console.log("data");
  })
}
```

#### instanceof 的原理:
> 我们在使用 instanceof进行实例判断时 其实 实例会去找它的__proto__属性的值,如果能找到,则返回true

```javascript
class My {
}

let a = new My();
a.__proto__ = Array.prototype;
console.log(a instanceof Array);//true


```
### Class
> ES5中的类
使用ES5中的类特点:使用`function`来进行模仿的
```javascript
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

}
```

#### 实例 & 类 & Object的关系

```javascript
let dog=new Animal('张三');
dog.name//张三
```
name是dog实例的属性 找到name是通过this.找到的
eat是dog的共有属性 如何找到eat方法的呢?
dog中有一个属性 `__proto__ `用于指向`Animal.prototype`而在`Animal.prototype`对象中有一个`constructor`指向`Animal`


例子:
```javascript
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
```


#### 类的继承

```javascript
function Animal(){
  this.type='哺乳动物'
}
Animal.prototype.eat=function(){
  console.log("我在吃东西");
}

function Dog(name){
  this.name=name;
  Animal.call(this);
}
// Dog.prototype.__proto__=Animal.prototype;
// Object.setPrototypeOf(Dog.prototype, Animal.prototype)
Reflect.setPrototypeOf(Dog.prototype, Animal.prototype);
let dog=new Dog('zhangsan');
console.log(dog.name);
console.log(dog.type);
dog.eat();

//这三句话的意思是相同的:
// Dog.prototype.__proto__=Animal.prototype;
// Object.setPrototypeOf(Dog.prototype, Animal.prototype)
// Reflect.setPrototypeOf(Dog.prototype, Animal.prototype);


//原理:
//Animal.call(this);// 想要再dog中有Animal中的实例属性,只能改变this的指向
//在Dog中的this是dog 所以执行下Animal并修改Animal的this指向即可

//Dog.prototype.__proto__=Animal.prototype;
//如何才能找到Animal中的prototype中的方法呢?
//dog先找自己的实例方法发现没有eat,再通过它的__proto__找到Dog的prototype,发现还是没有eat方法
//这时我们希望 再去找Animal的prototype有误eat方法怎么办呢?
//当Dog.prototype中找不到时就会通过Dog.prototype.__proto__去找上一级,而我们改变了它的__proto__属性,让他指向Animal的prototype 这样就形成了一个原型链

```

#### 继承的第二种方法
```javascript
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
  Dog.prototype = Object.create(Animal.prototype, { constructor: { value: Dog } });
}

let dog = new Dog('zhangsan');
console.log(dog.name);
console.log(dog.type);
dog.eat();
```