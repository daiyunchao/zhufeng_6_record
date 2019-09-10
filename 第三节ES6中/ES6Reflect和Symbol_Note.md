### Reflect && Symbol && ES6模块 && class类

#### Reflect 反射
    ```javascript

    //1.get && set 设置/获取属性的值
    //用Reflect设置和获取obj的值
    let obj = {};
    Reflect.set(obj, 'name', 'zhangsan');
    console.log(obj.name);
    console.log(Reflect.get(obj,'name'));


    //2.has 判断对象中是否有属性
    //使用Reflect判断key是否在对象中存在
    let zhangsan={name:"zhangsan"}
    //使用in
    console.log("name" in zhangsan);

    console.log(Reflect.has(zhangsan,'name'));
    

    //3.defineProperty 定义对象属性
    //使用Reflect设置属性
    let zhangsan = { name: 'zhangsan' };
      Object.defineProperty(zhangsan, 'name', {
        value: 'zhangsan'
      });

      //用法和Object.defineProperty相同
      Reflect.defineProperty(zhangsan,'age',{
        value:18
      });

      console.log(zhangsan);


    //为什么要用Reflect.defineProperty呢?
    //例子:
    let zhangsan = { name: "zhangsan" };
    Object.freeze(zhangsan)
    Object.defineProperty(zhangsan, 'a', {
      value: 100
    });

    //用Object.freeze方法将zhangsan对象进行冻结,然后在使用Object.defineProperty的方式对zhangsan的属性进行赋值
    //此时因为zhangsan已经被冻结了,再定义属性时会报错

    //而如果使用Reflect则不会
    let zhangsan = { name: "zhangsan" };
    Object.freeze(zhangsan)
    let flag=Reflect.defineProperty(zhangsan,'age',{
      value:18
    })
    console.log(flag);
    console.log(zhangsan);

    //该方法会有一个返回值,标识是否设置成功


    //4.getOwnPropertyDescriptor 获取属性描述符 value writeable enumerable configurable
    let zhangsan = { name: "zhangsan" };
    console.log(Object.getOwnPropertyDescriptor(zhangsan,'name'));

    //5.ownKeys 获取对象全部的key(包括Symbol的属性)

    let zhangsan = { name: "zhangsan",[Symbol()]:18 };
    console.log(Object.keys(zhangsan));//获取对象的全部key,但不能获取到symbol的属性
    console.log(Object.getOwnPropertyNames(zhangsan));//获取对象的全部key,但不能获取到symbol的属性
    console.log(Object.getOwnPropertySymbols(zhangsan));//获取对象的全部Symbol的key值
    console.log(Reflect.ownKeys(zhangsan));

    //6.apply
    //使用普通的aplly方法:
    let fn=function(a,b){
      console.log(this,a,b);
    }

    fn.apply(1,[2,3]);

    //当fn中有一个同名方法:apply呢
    fn.apply=function(){
      console.log("this is apply")
    }
    
    //如何调用原型链上的apply呢?
    //直接调用prototype上的apply方法
    Function.prototype.apply.call(fn);

    //使用Reflect如何实现呢?
    Reflect.apply(fn,1,[2,3]);
    //上面的两个方法是完全等价的


    //7.deleteProperty删除属性

    //使用delete 属性的方法:
    let zhangsan = { name: "zhangsan" };
    Object.freeze(zhangsan)
    delete zhangsan.name;
    console.log(zhangsan);

    //没有报错,也没有删除掉

    //使用Reflect.deleteProperty
    let zhangsan = { name: "zhangsan" };
    Object.freeze(zhangsan)
    let flag = Reflect.deleteProperty(zhangsan,'name');
    console.log(flag);
    //删除失败了会有返回值告诉我们 删除失败了

    //8.preventExtensions 不允许对象添加字段
    let zhangsan = { name: "zhangsan" };
    Object.preventExtensions(zhangsan);
    zhangsan.age=20;
    console.log(zhangsan);

    //功能相同,多了一个返回值
    let zhangsan = { name: "zhangsan" };
    let flag=Reflect.preventExtensions(zhangsan);
    zhangsan.age=20;
    console.log(flag);
    console.log(zhangsan);

    //9.isExtensible判断对象是否可以被扩展的
    let zhangsan = { name: "zhangsan" };
    let flag=Reflect.preventExtensions(zhangsan);
    console.log(Object.isExtensible(zhangsan));

    let zhangsan = { name: "zhangsan" };
    let flag=Reflect.preventExtensions(zhangsan);
    console.log(Reflect.isExtensible(zhangsan));

    ```
#### Symbol 他的值是独一无二
1. 作为常量使用
  ```javascript
  const s1=Symbol('zhangsan');
  const s2=Symbol('zhangsan');
  console.log(s1==s2);
  ```
2. 属性私有化
3. Symbol.for

  ```javascript
  //Symbol('zhangsan') 是每次创建一个Symbol 而使用Symbol.for是先去找有相同key的Symbol没,没有才创建,如果有直接返回
  const s1=Symbol.for('zhangsan');
  const s2=Symbol.for('zhangsan');
  console.log(s1===s2)//true
  ```
4. Symbol.keyFor() 获取Symbol的key值

  ```javascript
  const s1=Symbol.for('zhangsan');
  Symbol.keyFor(s1)//zhangsan
  ```
5. 将Symbol当成对象的属性
  ```javascript
  const s1=Symbol('name');
  let zhangsan={
    [s1]:'zhangsan'//将s1的值当成zhangsan对象的key
  }
  console.log(zhangsan[s1]);//这里不能使用"."来获取值
  ```
6. 元编程,
6.1. 通过`Symbol.hasInstance`改变原js的能力
  ```javascript
    let o = {
      name: 'zhangsan'
    }

    let obj = {
    }
    // console.log(o instanceof obj);
    //Right-hand side of 'instanceof' is not callable


    //使用Symbol.hasInstance()方法改变js的instanceof方法
    //Symbol.hasInstance 当调用:instanceof obj时,会去调用使用Symbol.hasInstance()
    obj = {
      [Symbol.hasInstance]() {
        return 'name' in o
      }
    }

    console.log(o instanceof obj);
  ```
6.2. 通过`Symbol.toStringTag`改变对象的`toString`行为
```javascript
  //原来的写法:
  let zhangsan={
    toString(){
      return "zhangsan"
    }
  }

  console.log(zhangsan+"")

  //使用Symbol的写法:
  let zhangsan={
  get [Symbol.toStringTag](){
    return 'zhangsan'
    }
  }

  console.log(zhangsan+"")//[object zhangsan]

```
7. 控制衍生对象的类的构造函数

```javascript
    class MyArray extends Array {
      constructor(...args) {
        super(...args)
      }
      static get [Symbol.species](){
        return Array;//控制衍生对象的所属类型
      }
    }

    let myArr = new MyArray(1,2,3);
    console.log(myArr);
    console.log(myArr instanceof MyArray);
    console.log(myArr instanceof Array);

    //newArr就是衍生对象
    let newArr=myArr.map(item=>item*2);
    console.log(newArr);
    console.log(newArr instanceof MyArray);

```




