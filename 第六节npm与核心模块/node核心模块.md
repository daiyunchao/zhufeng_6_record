### Node的核心模块

#### util.promisify 将普通的回调函数,转换成promise函数
> 但必须是规范的Node方法(一定要满足错误优先的规则)
使用`util.promisify`的例子
```javascript
//ncp模块是copy文件/文件夹的第三方模块
let ncp = require('ncp');
let path = require('path')
let util = require('util')
ncp = util.promisify(ncp);
ncp(path.join(__dirname, './1.txt'), path.join(__dirname, './2.txt'), (err) => {
  if (err) {
    return console.log("copy has some error");
  }
  console.log("copy success");
});

//那么如何实现util.promisify功能的呢
function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data);
      });
    })
  }
}
```

#### util.inherits 继承,不过现在都使用class了
> 注意:使用`til.inherits`只能继承公共方法
```javascript
//原来的写法:
function Parent(type) {
  this.type = type;
  console.log("type==>",type);
  
}
Parent.prototype.getType = function () {
  return this.type;
}
function Child(name,type) {
  this.name = name;
  Parent.call(this,type);
}

Reflect.setPrototypeOf(Child.prototype, Parent.prototype);

let zhangsan = new Child('zhangsan','person');
console.log(zhangsan.name);
console.log(zhangsan.type);
console.log(zhangsan.getType());

//使用util.inherits的写法:
const util=require('util')
function Parent(type) {
  this.type = type;
  console.log("type==>",type);
  
}
Parent.prototype.getType = function () {
  return this.type;
}
function Child(name,type) {
  this.name = name;
  Parent.call(this,type);
}

util.inherits(Child,Parent);
let zhangsan = new Child('zhangsan','person');
console.log(zhangsan.name);
console.log(zhangsan.type);
console.log(zhangsan.getType());

```

#### util.inspect 可以查看到隐藏属性
```javascript
util.inspect(Array.prototype)
//可查看到Array原型上的全部方法
```

#### 事件模块
```javascript
//基本使用:
const Events=require('events');
let event=new Events();
function myEvent(){
  console.log("in myEvent");
}
event.on('myevent',myEvent);

event.emit('myevent');

//如果我的自定义类想使用Event呢?
const Events = require('events');
// let event=new Events();
class MyEvent extends Events {

}
myEvent = new MyEvent();
function myEvent1() {
  console.log("in myEvent");
}
myEvent.on('myevent', myEvent1);

myEvent.emit('myevent');

//如何自己实现一个Event?
class Events {
  constructor() {
    this.eventList = {};
  }
  on(eventName, eventCallback) {
    if (this.eventList[eventName]) {
      this.eventList[eventName].push(eventCallback)
    } else {
      this.eventList[eventName] = [eventCallback];
    }
  }
  emit(eventName) {
    let events = this.eventList[eventName];
    events.forEach(item => {
      item();
    });
  }
}
class MyEvent extends Events {

}
myEvent = new MyEvent();
function myEvent1() {
  console.log("in myEvent");
}
myEvent.on('myevent', myEvent1);

myEvent.emit('myevent');
```

#### Evnets的 newListener 监听用户监听了哪些监听
```javascript

const Events=require('events');
const eventEmitter=new Events();
//只要用户监听了任意事件,都会执行该回调
eventEmitter.on('newListener',(type)=>{
  console.log(type)
})
```

#### 自己写的完整版本
```javascript
class MyEvents {
  constructor() {
    this._events = {};
  }


  on(eventName, callback) {
    this._events[eventName] = this._events[eventName] ? this._events[eventName] : [];
    if (eventName !== 'newListener') {
      //如果是绑定的特殊的监听器
      this.emit('newListener', eventName);
    }
    this._events[eventName].push(callback);
  }

  once(eventName, callback) {
    //绑定一次,当执行完成后再解绑
    const one = (...args) => {
      callback(...args);
      this.off(eventName, one);
    }
    one.callback = callback;
    this.on(eventName, one);
  }

  emit(eventName, ...args) {
    this._events[eventName] = this._events[eventName] ? this._events[eventName] : [];
    this._events[eventName].forEach(callback => {
      callback(...args);
    });
  }

  off(eventName, callback) {
    console.log("off",callback);
    
    this._events[eventName] = this._events[eventName] ? this._events[eventName] : [];
    this._events[eventName] = this._events[eventName].filter(item => {
      console.log(item.callback);
      
      if (item === callback || item.callback === callback) {        
        return false;
      }
      return true;
    })
  }
}

class Person extends MyEvents{

}

let zhangsan=new Person();
let cf=function(){
  console.log("吃饭");
}
let sj=function(name){
  console.log(name,"睡觉");
}

let sj2=function(name){
  console.log(name,"睡觉");
}


zhangsan.on('newListener',(eventName)=>{
  if (eventName==='饱了') {
    console.log("又想睡觉了");
  }
})

zhangsan.on('饿了',cf)
zhangsan.on('饱了',sj)
zhangsan.once('饱了2',sj2)
zhangsan.off('饱了2',sj2)
zhangsan.emit('饿了');
zhangsan.emit('饱了','张三');
zhangsan.emit('饱了','李四');
zhangsan.emit('饱了2','张三2');
zhangsan.emit('饱了2','李四2');

```
