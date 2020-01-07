### Vue基础
- 特点 : 易上手 灵活 高效 
- 什么是库,库是 我们主动调用它的方法(jquery lodash)
- 什么是框架 我们将代码写道指定的地方,由它来调用(vue react 的钩子函数)
- mvvm是mvc的一种进步 数据和视图的绑定,就不需要control来控制数据
  

  #### 使用方法
  1. 直接引用使用
```html
<div id="root">{{name}}</div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
       let vm= new Vue({
            el:"#root",//绑定节点
            data(){//提供数据
                return {
                    name:"zhangsan"
                }
            }
        });
        vm.name='lisi'
    </script>
```

```javascript
//如何是先数据修改了UI一起刷新呢? 原理:
var data={name:"zhangsan"};
function observerProp(obj,key,value){
	Object.defineProperty(obj,key,{
		get(){
			return value;
		},
		set(newValue){
			if(value!=newValue){
				value=newValue;
				console.log("数据更新了,请刷新UI")
			}
		}
	})
}
```

#### vue监听数据变化的原理
```javascript
// vue中最核心的部分
// 观察一个数据Vue2.0 definePropety, 针对数组 length
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

// 只针对对象 数组没有使用definePropety的

let arrayProto = Array.prototype; // 数组原型上的方法,这是原来的数组原型上的方法
let proto = Object.create(arrayProto);//居于arrayProto创建了一个新的对象(proto的原型对象是arrayProto)

//当数组调用这些时,可能有数据上的变化,如果变化的数据是对象,那么也应该被监听到
['push','unshift','splice','reverse','sort','shift','pop'].forEach(method=>{
	
	//重写这些方法(这是为了在原来原型方法的基础上实现监听
    proto[method] = function (...args) { // 这个数组应该也被监控
        // Array.prototype.push.call([1,2,3],4,5,6);
        let inserted; // 默认没有插入新的数据
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args//当有新的值插入的时候,需要监听新的值变化
                break;
            case 'splice': // 数组的splice 只有传递三个参数 才有追加效果
                inserted = args.slice(2);
            default:
                break;
        }
        console.log('视图更新');
        ArrayObserver(inserted)
        arrayProto[method].call(this, ...args)
    }
});
function ArrayObserver(obj) {
    for (let i = 0; i < obj.length; i++) {
        let item = obj[i];
        // 如果是普通值 就不监控了
        observer(item); // 如果是对象会被 defineReactive
    }
}
function observer(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        
		//修改obj的原型指向了proto,而proto是修改过原型方法的所以能监听到值的变化
        Object.setPrototypeOf(obj,proto);
        ArrayObserver(obj)
    } else {
        // 下面的是处理对象的
        for (let key in obj) {
            // 默认只循环第一层
            defineReactive(obj, key, obj[key]);
        }
    }
}

function defineReactive(obj, key, value) {
    observer(value); // 递归创建 响应式数据，性能不好
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) { // 给某个key设置值的时候 可能也是一个对象
            if (value !== newValue) {
                observer(newValue);
                value = newValue
                console.log('视图更新');
            }
        }
    })
}
let data = {
    d: [1, 2, 3,{name:'zf'}]
};
observer(data);
data.d = [1,2,3]
// observer(data);
// data.name = {n:'jw'}
// data.name.n = 'zf';
// 特点： 使用对象的时候 必须先声明属性 ，这个属性才是响应式的
// 1.增加不存在的属性 不能更新视图 （vm.$set）
// 2。默认会递归增加 getter和setter
// 3.数组里套对象 对象是支持响应式变化的，如果是常量则没有效果
// 4.修改数组索引和长度 是不会导致视图更新的
// 5.如果新增的数据 vue中也会帮你监控（对象类型）

```

### vm中的实例方法
1. `vm.$el` 真实dom元素
```html
<div id="root">{{name}}</div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
       let vm= new Vue({
            el:"#root",//绑定节点
            data(){//提供数据
                return {
                    name:"zhangsan"
                }
            }
        });
        console.log(vm.$el)//<div id="root">zhangsan</div>
    </script>
```
2. `vm.$watch` 监听数据变化
```html
<div id="root">{{name}}</div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
       let vm= new Vue({
            el:"#root",//绑定节点
            data(){//提供数据
                return {
                    name:"zhangsan"
                }
            }
        });

        //监听了name的变化
        //但这个实例中只会执行一次
        vm.$watch('name',function(newValue,oldValue){
            console.log("newValue==>",newValue)
        });

        //更新了两次的值
        //注意这里的视图的更新是异步的,是下一个eventloop中执行的
        vm.name="lisi";
        vm.name="wangwu";
        console.log(vm.$el)//<div id="root">zhangsan</div>
    </script>
```

3. `vm.$nextTick`获取渲染后的结果
```html
<div id="root">{{name}}</div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
       let vm= new Vue({
            el:"#root",//绑定节点
            data(){//提供数据
                return {
                    name:"zhangsan"
                }
            }
        });
        //监听了name的变化
        //但这个实例中只会执行一次
        vm.$watch('name',function(newValue,oldValue){
            console.log("newValue==>",newValue)
        });

        //更新了两次的值
        //注意这里的视图的更新是异步的,是下一个eventloop中执行的
        vm.name="lisi";
        vm.name="wangwu";
        console.log(vm.$el.innerHTML)//zhangsan 注意这里获取到的是zhangsan,因为这个时候视图还没有被更新

        //想要获取修改后的值:
        vm.$nextTick(()=>{
            console.log(vm.$el.innerHTML)//wangwu 获取到了更新后的值
        })
    </script>
```
