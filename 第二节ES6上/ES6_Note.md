
### let && const
```javascript
let a=10;
{
  console.log(a);
  let a=100;
}
//let 声明的变量会绑定到当前的作用域上
//Uncaught ReferenceError: Cannot access 'a' before initialization
```

```javascript
let fn=function a(){

}

console.log(fn);
console.log(a)//a is not defined

var fn=function a(){

}

console.log(fn);
console.log(a)//a is not defined

//var 和 let 都一样都获取不到函数名 a
```


### 解构赋值&剩余运算符&展开

#### 解构赋值
```javascript
//数组解构赋值:
let [name,age]=['zhangsan',18];
//只获取第二项
let [,age]=['zhangsan',18];

//对象的解构赋值
let {name,age}={name:'zhangsan',age:18};
//变量重命名
let {name:hisName,age:hisAge}={name:'zhangsan',age:18}
//默认赋值
let {name,age,address='默认地址'}={name:'zhangsan',age:18}
console.log(hisName,hisAge)

```

#### 对象的解构赋值
```javascript


```

#### 剩余运算符
```javascript
//需求 从['zhangsan',18,'成都']获取zhangsan,并将 18,成都 在组成新的数组

let [name,...args]=['zhangsan',18,'成都'];
console.log(name,args);

//需求 从['zhangsan',18,'成都']去掉第一项后面的组成数组
//ES5:
var arr=['zhangsan',18,'成都'];
arr.splice(0,1);
console.log(arr);

//ES6:
let arr=['zhangsan',18,'成都'];
[,...args]=arr;
console.log(args);


//对象的剩余运算符
let zhangsan={name:'zhangsan',age:18,address:'成都'};
let {name,...args}=zhangsan;
console.log(args);//{age:18,address:'成都'}

//该方法可用于copy对象:
let zhangsan={name:'zhangsan',age:18,address:'成都'};
let lisi=zhangsan
console.log(zhangsan===lisi);

let {...args}=zhangsan;
console.log(args===zhangsan);

```

#### 展开
```javascript

//数组的展开:
let arr=[1,2,3];
console.log(...arr);

//运用展开运算符 合并数组:
let a1=[1,2,3];
let a2=[4,5,6];
let a3=[...a1,...a2];

//扩展 合并去重:
let a1=[1,2,3];
let a2=[3,2,5,6];
let a3=[...a1,...a2];
let a4=[...new Set(a3)];

//扩展 交集
let s1=new Set(a1);
let s2=new Set(a2);

let a3=a1.filter((item)=>s2.has(item))
console.log(a3);

//扩展 并集
let a3=[...a1,...a2];
let a4=[...new Set(a3)];

//扩展 差集
let s1=new Set(a1);
let s2=new Set(a2);

let a3=a1.filter((item)=>!s2.has(item))
console.log(a3);


//对象的展开(浅拷贝,只拷贝了一层) 功能同 Object.assign()
let zhangsan_name={name:"zhangsan"};
let zhangsan_age={age:20};
let zhangsan_address={address:"成都"};
let zhangsan={...zhangsan_name,...zhangsan_age,...zhangsan_address};
console.log(zhangsan);
//{name: "zhangsan", age: 20, address: "成都"}

//注意点:同名的key会被后面的key代替掉

//扩展:如何实现一个深拷贝呢?
//可以用 JSON.parse(JSON.stringify(newObj))实现 但有缺憾,不能很好的识别函数,正则表达式


//例子:
//浅拷贝例子:
let zhangsan_name = { "name": "zhangsan", "age": 18, son: { "name": "lisi", "age": 1 } }
let zhangsan_address = { "address": "成都" };
let zhangsan = { ...zhangsan_name, ...zhangsan_address };
console.log("zhangsan==>", zhangsan);
zhangsan.son.name = "wangwu";
console.log("zhangsan==>", zhangsan);
console.log("zhangsan_name==>", zhangsan_name);//跟着一起改变了


//深拷贝
let deepClone = (value,hash=new WeakMap) => {
  //判断是否是null值或是undefined
  if (value == null) {
    return value;
  }

  //判断是否是普通类型或是函数类型,如果是普通类型则返回
  if (typeof value !== 'object') {
    //如果不是object,则是普通类型
    return value;
  }

  //如果是object类型,则判断类型,构建不同的类型
  if (value instanceof Date) {
    return new Date(value)
  }
  if (value instanceof RegExp) {
    return new RegExp(value)
  }

  //其他对象类型,或是数组类型
  //如果是对象,则会获取一个新的{}
  //如果是数组,则会获取一个新的[]
  let newValue = new value.constructor;
  if(hash.has(value)){
    return hash.get(value)
  }
  hash.set(value,newValue);
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      newValue[key] = deepClone(value[key],hash);
    }
  }
  return newValue;
}

let zhangsan_name2 = { "name": "zhangsan", "age": 18, son: { "name": "lisi", "age": 1 } }
let zhangsan_address2 = { "address": "成都" };
let zhangsan2 = { ...deepClone(zhangsan_name2), ...deepClone(zhangsan_address2) }
console.log("zhangsan2===>", zhangsan2);
zhangsan2.son.name = "wangwu";
console.log("zhangsan2 new ===>", zhangsan2);
console.log("zhangsan_name2===>", zhangsan_name2);


```


### Object.defineProperty & Proxy

```javascript
//Object.defineProperty的getter 和 setter简写方式:
let obj={
  _a:'',
  get a(){
    console.log("获取a的值");
    return this._a
  }
  set a(value){
    console.log("设置a的值");
    this._a=value;
  }
}

console.log(obj.a);//获取a的值


// Object.definfProperty的基本写法
let obj = {};
Object.defineProperty(obj, 'a', {
  writable: true,//是否可以被更改
  enumerable: true,//是否可以被循环出来 for-in
  configurable:true,//是否可以被删除
  value: 100
})
obj.a = 20;
delete obj.a;
console.log(obj);
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    const item = obj[key];
    console.log("item==>", item);
  }
}

//使用getter和setter
let obj = {};
let _a;
Object.defineProperty(obj, 'a', {
  // writable: true,//是否可以被更改
  enumerable: true,//是否可以被循环出来 for-in
  configurable: true,//是否可以被删除
  get() {
    return _a;
  },
  set(value) {
    console.log("in a set");
    _a = value;
  }

})
obj.a = 20;
delete obj.a;
console.log(obj);
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    const item = obj[key];
    console.log("item==>", item);
  }
}


//使用 Object.defineProperty实现监控一个对象

let obj = {
  name: "zhangsan",
  age: 18,
  son: {
    name: 'lisi',
    age: 2
  }
}

//监控对象(问题,不能监控数组的长度的变化,因为是单个属性进行监控,新增的属性不能有效的监控到)
let observer = (obj) => {
  if (typeof obj !== 'object') {
    //普通类型
    return;
  }

  //如果是对象类型
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];
      //可能这个value值也是一个对象
      //对value值再进行一次监控(如果是普通值则不会被监控,如果是对象则会再次被监控)
      observer(value);
      Object.defineProperty(obj, key, {
        get() {
          //取值
          console.log("this is get ");
          return value;
        },
        set(val) {
          //设值
          console.log("this is set");
          value = val;
        }
      })
    }
  }
}

observer(obj);
console.log(obj.name);
obj.name = 'lisi'
console.log(obj.name);
console.log(obj.age);
console.log(obj.son.name);


//Proxy 代理:
//拦截

//使用Proxy实现监控对象属性

//监控对象,set方法只能监控一级
let _zhangsan = {
  name: 'zhangsan',
  age: 18,
  son: {
    name: 'lisi',
    age: 1
  }
}

zhangsan = new Proxy(_zhangsan, {
  get(target, key) {
    console.log("进入get");
    return target[key];
  },
  set(target, key, value) {
    console.log("进入set");
    target[key] = value;
  }
})

zhangsan.name = 'lisi';
zhangsan.age = 20;
console.log(zhangsan.name);
console.log(zhangsan.age);
zhangsan.son.name = 'wangwu';
console.log(zhangsan.son.name);


//监控数组
let _arr = [1, 2, 3];

arr = new Proxy(_arr, {
  get(target, key) {
    console.log("进入get");
    return target[key];
  },
  set(target, key, value) {
    console.log("进入set");
    target[key] = value;
  }
});

arr.push(1);

//实现Proxy监控多级对象

let _zhangsan = {
  name: 'zhangsan',
  age: 18,
  son: {
    name: 'lisi',
    age: 1
  }
}

let observer = (obj) => {
  let cache = new WeakMap;
  let handler = {
    get(target, key) {
      console.log("进入get");
      if (typeof target[key] === 'object' && target[key] != null) {
        if (cache.has(target[key])) {
          return cache.get(target[key]);
        }
        let newProxy = new Proxy(target[key], handler);
        cache.set(target[key], newProxy);
        return newProxy;
      }
      return target[key];
    },
    set(target, key, value) {
      console.log("进入set");
      target[key] = value;
    }
  }
  return new Proxy(obj, handler)
}

let zhangsan=observer(_zhangsan);
zhangsan.son.name='lisi';


```