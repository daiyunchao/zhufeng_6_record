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
4. `vm.$data`表示vm中的data `vm.$options`表示vm对象
5. `vm.$set()`为vm的data设置新的值为什么有这个方法(因为在向data中添加新的属性时是不会生效的) `vm.$delete()`删除vm的data属性
```html
<div id="root">{{name}}</div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
       let vm= new Vue({
            el:"#root",//绑定节点
            data(){//提供数据
                return {
                    name:"zhangsan",
                    ages:{}
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

        vm.ages.age=18;//注意 这里是不会生效的,因为age并没有定义在data返回的对象中
        //应该使用
        vm.$set(vm.ages,'age',18);
    </script>
```

#### vue指令

- 指令的功能是封装操作dom的功能
- `{{}}`这种语法在vue中叫 小胡子语法,能取值,运算(获取运算结果) 三元表达式 例子`{{name}} {{1+1}} {{1==true?"yes":"no"}} {{[1,2,3]}} {{ {name:'zhangsan'} }}` 注意在`{{}}`中写对象的时候 两边需要添加空格,否则会解析不出来
- `v-once`只渲染一次,再有修改它的值,将不会被渲染
```html
<div id="root">
    {{name}}
<div v-once>v-once{{name}}</div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                name: "zhangsan"
            }
        }
    });
    
</script>
```
- `v-html`将内容按照html的样子输出
```html
<div id="root">
    {{name}}
    <!-- 这就会原样的输出html -->
<div v-html="temp"></div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                temp:"<h1>this is some text</h1>"
                name: "zhangsan"
            }
        }
    });
    
</script>
```
- `v-bind`绑定一个值

```html
<div id="root">
    {{name}}
    <!-- 将title属性的值绑定成data的name -->
<div v-bind:title="name">你好</div>
    <!-- 简写的方式 -->
<div :title="name">你好</div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                temp:"<h1>this is some text</h1>"
                name: "zhangsan"
            }
        }
    });
    
</script>
```

- `v-for`循环数据
```html
<div id="root">
    <ul>
        <!-- 使用v-for进行循环 :key绑定key值为index(这里会有性能上的问题) -->
        <li v-for="(value,index) in arr" :key="index">
            {{value}}
        </li>
    </ul>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                name: "zhangsan",
                arr: ["张三", "李四", "王五"]
            }
        }
    });
</script>

<!-- 循环多个li -->
<div id="root">
    <ul>
        <!-- 使用到 template template是一个无意义的标签不会产生无意义的标签 -->
        <template v-for="(item,index) in arr">
            <li :key="`name_${index}`">
                {{item.name}}
            </li>
            <li :key="`age_${index}`">
                {{item.age}}
            </li>
        </template>


    </ul>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                name: "zhangsan",
                arr: [{
                        name: "zhangsan",
                        age: 18
                    },
                    {
                        name: "lisi",
                        age: 20
                    },
                    {
                        name: "wangwu",
                        age: 22
                    },
                ]
            }
        }
    });
</script>
```
- `v-if v-else` 元素是否存在 `v-show`元素是否显示不能和`template`一起使用,因为template不是一个真实的dom节点,不能控制不存在的节点是否显示
```html
<div id="root">
    <template v-if="isShow">
        <span>if{{name}}</span>
    </template>
    <template v-else>
        <span>else{{name}}</span>
    </template>
   
    <div v-show="!isShow">
        <span>show{{name}}</span>
    </div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        data() { //提供数据
            return {
                isShow:false,
                name: "zhangsan"
            }
        }
    });
</script>
```
- `v-model`双向绑定
```html
<div id="root">
    <template v-if="isShow">
        <span>if{{name}}</span>
    </template>
    <template v-else="!isShow">
        <span>else{{name}}</span>
    </template>

    <div v-show="!isShow">
        <span>show{{name}}</span>
    </div>

    <div>
        <span>{{name}}</span>
        <input type="text" :value="name" @input="changeName">
        <!-- 意思是相同的,@是v-on:的简写 -->
        <input type="text" :value="name" v-on:input="changeName">

        <!-- 将方法直接写在html中-->
        <input type="text" :value="name" @input="e=>name=e.target.value">
        
        <!-- v-model 是 value 和 @input的简写 -->
        <!-- input -->
        <input type="text" v-model="name">

    </div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        methods: {
            //vue的缺点:在methods中都将this指定到了vm对象
            changeName(e) {
                this.name = e.target.value;
            }
        },
        data() { //提供数据
            return {
                isShow: false,
                name: "zhangsan"
            }
        }
    });
</script>
```

### vue base 基础二
- 常用`v-model`指令
```html
<div id="root">
    <template v-if="isShow">
        <span>if{{name}}</span>
    </template>
    <template v-else="!isShow">
        <span>else{{name}}</span>
    </template>

    <div v-show="!isShow">
        <span>show{{name}}</span>
    </div>

    <div>
        <span>{{name}}</span>
        <input type="text" :value="name" @input="changeName">
        <!-- 意思是相同的,@是v-on:的简写 -->
        <input type="text" :value="name" v-on:input="changeName">

        <!-- 将方法直接写在html中-->
        <input type="text" :value="name" @input="e=>name=e.target.value">

        <!-- v-model 是 value 和 @input的简写 -->
        <input type="text" v-model="name">

        <!-- 绑定textarea -->
        <textarea v-model="name" cols="30" rows="10"></textarea>
        <!-- select绑定值 -->
        <select name="" id="" v-model="selectId">
            <!-- 默认值 不能选择-->
            <option value="" disabled>请选择</option>
            <option :value="item.id" v-for="item in options">
                {{item.name}}
            </option>
        </select>

        <!-- 绑定radio 根据value值是否相等而选中-->
        <input type="radio" value="男" v-model="gender">Boy
        <input type="radio" value="女" v-model="gender">Girl


        <!-- 绑定checkbox -->
        <input type="checkbox" value="游泳" v-model="checkboxValue">
        <input type="checkbox" value="健身" v-model="checkboxValue">

        <!-- 在v-model指令后添加修饰符 trim-->
        <input type="text" v-model.trim="name">
        
        <!-- 限制只能数字 -->
        <input type="text" v-model.number="name">
    </div>
</div>
<div id="root"></div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    let vm = new Vue({
        el: "#root", //绑定节点
        methods: {
            //vue的缺点:在methods中都将this指定到了vm对象
            changeName(e) {
                this.name = e.target.value;
            }
        },
        data() { //提供数据
            return {
                isShow: false,
                name: "zhangsan",
                gender: "男",
                selectId: "",
                checkboxValue: [],
                options: [{
                        "name": "张三",
                        id: "zhangsan"
                    },
                    {
                        "name": "李四",
                        id: "lisi"
                    },
                    {
                        "name": "王五",
                        id: "wangwu"
                    },
                ]
            }
        }
    });
</script>
```

- 自定义指令
- vue的指令包含`v-model.trim="abc"` `v-指令名.修饰符.修饰符="变量名"`
- 自动创建一个`focus`指令,自动获取焦点
```html
<body>
    <div id="root">
        <input type="text" v-focus="name">
    </div>
    <script src="./node_modules/vue/dist/vue.min.js"></script>
    <script>
        //创建一个全局指令
        //目的希望使用该指令实现 页面初始化后自动获取焦点
        Vue.directive('focus', {
            //当指令被插入到page中时会被触发
            //参数:
            //el:dom元素
            //bindings,绑定的详细信息(包含绑定的变量名等)
            //vnode:虚拟节点,当前指令的上下文 vnode.context表示当前的vm对象
            inserted(el, bindings, vnode) {
                console.log("el==>", el);
                console.log("bindings==>", bindings);
                console.log("vnode==>", vnode);
                el.focus();


            },
            //当数据绑定到元素上时会被触发
            bind(el, bindings, vnode) {
                //当绑定的时候将
                el.value = bindings.value;
            },

            //当解绑时被调用
            //执行流程是 inserted => bind=>update=>unbind
            unbind(el,bindings,vnode){

            },
            //当值被修改时会被触发
            update(el, bindings, vnode) {
                el.value = bindings.value;
            }
        })
        let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan"
                }
            }
        })
    </script>
</body>
```

- 自定义一个局部指令
```html
//需要实现一个当我获取焦点时input下的div显示
//当我点其他地方时div消失
<body>
    <div id="root">
        <div v-click-outside>
            <input type="text" @focus="focus()">
            <div v-show="isShow" style="width:200px;height:200px;background-color:aqua">
                <button>点击</button>
            </div>
        </div>
    </div>
    <script src="./node_modules/vue/dist/vue.min.js"></script>
    <script>
        let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },
            //声明指令(在vm对象中声明的就是局部指令)
            directives: {
                //少了v将下划线变成驼峰
                "clickOutside": {
                    bind(el, bingdings, vnode) {
                        //在el当前元素中添加一个函数方便调用
                        el.fn = function (e) {
                            //如果点击的目标是外部div的一部分,则不消失
                            
                            if (!el.contains(e.target)) {
                                //vnode的上下文就是当前的vm对象
                                vnode.context.blur();
                            }
                        }
                        document.addEventListener('click', el.fn)
                    },
                    unbind(el, bingdings, vnode) {
                        //当我卸载组件的时候,希望删除对click的监听
                        document.removeEventListener('click', el.fn)
                    }
                }
            },
            methods: {
                focus() {
                    this.isShow = true;
                },
                blur() {
                    this.isShow = false;
                }
            }
        })
    </script>
</body>
```

- `watch`和`computed`
- `watch`是监听数据变化
- `computed`是当值变化后执行xx操作 都是居于$watch实现的
```javascript
let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },
            //watch方法
            watch: {
                name(newName) {
                    //收到数据改变后执行打印
                    console.log("newName==>", newName);
                }
            }
        })
```
watch的原理是居于$watch实现的
下面的代码等同于上面的代码
```javascript
let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },
            
        })
        //可以在外边绑定:
        // vm.$watch("name",function(newName){
        //     console.log("newName==>", newName);
        // })

        //自定义函数实现watch的方法
        function initWatch(watch) {
            for (const key in watch) {
                vm.$watch(key, watch[key])
            }
        }
        initWatch({
            name:function(newName){
                console.log("newName==>", newName);
            }
        });
```
watch的第二种写法
```javascript
let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },
            //watch的第二种写法
            watch: {
                //传递的不是函数而是一个对象
                name:{
                    handler(newValue){
                        console.log("newName==>", newName);
                    },
                    immediate:true,//当immediate为true时再最初赋值name的时候也会执行handler函数
                    deep:true,//是否开启深度监控,当我监控一个对象时有用处
                    lazy:true,//
                }
            }
        })
```

- computed基本原理

```javascript
<script>
        let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },

        });

        //最基本的computed实现
        function initComputed(key, handler) {

            //在vm中添加了字段
            Object.defineProperty(vm, key, {
                get() {
                    return handler();
                }
            })
        };
        initComputed('fullname', () => {
            return vm.name + ".皮特"
        });

        console.log(vm.fullname);
    </script>
```

- 在vm中使用`computed`
```javascript
let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    isShow: false,
                }
            },
            computed:{
                fullname(){
                    return this.name+".皮特"
                }
            }
        });

    //最基本的computed实现
    console.log(vm.fullname);
```
- watch和computed的区别
1. 都是监听数据的
2. watch是每次值改变回调函数就会被执行
3. conputed会在vm对象中添加一个缓存属性,当依赖的值改变下次再获取该属性时就重新执行回调获取新的值 它的原理是Object.defineProperty去创建了一个vm的属性,因为有缓存的存在,性能会比methods写的高一些

- 使用`computed`实现一个全选功能的小例子,使用到了`computed`的`set`方法
```javascript
 let vm = new Vue({
            el: "#root",
            data() {
                return {
                    name: "zhangsan",
                    fruits: [{
                            name: "苹果",
                            isChecked: false
                        },
                        {
                            name: "香蕉",
                            isChecked: true
                        },
                        {
                            name: "西瓜",
                            isChecked: false
                        }
                    ],
                }
            },
            //computed和watch都是new了一个$watch
            //computed有缓存,只要他的依赖不变值就不会重复执行
            computed: {
                allIsChecked: {
                    //get方法,当获取值的时候使用
                    get() {
                        return this.fruits.every(item => item.isChecked)
                    },
                    //set方法,当我双向绑定设置该值的时候使用到
                    set(value) {
                        this.fruits.forEach(item => {
                            item.isChecked = value;
                        });
                    }
                }
            }
        });

```

- vue动画,能触发vue中动画的指令有`v-if v-show v-for(当数量有改变) 路由改变`

- 使用vue动画实现的一个现实隐藏小例子
```html
<style>
        .content {
            width: 200px;
            height: 200px;
            background: black;
        }


        /* 写动画的样式 */
        .v-enter {
            /* 开始动画前 */
            background: white;
        }

        .v-enter-active {
            /* 动画执行过程中 */
            background: wheat;
            transition: all 2s linear;
        }

        .v-enter-to {
            /* 动画执行完 */
            background: black;
        }

        .v-leave {
            /* 准备离开 */
            background: black;
        }

        .v-leave-active {
            /* 开始离开 */
            background: wheat;
            transition: all 2s linear;
        }

        .v-leave-to {
            /* 离开结束 */
            background: white;
        }
    </style>
</head>

<body>
    <div id="root">
        <div>
            <button @click="changeShowStatus()">点击</button>
            <!-- 将需要动画的内容先使用transition包裹下 -->
            <transition>
                <div class="content" v-show="isShow"></div>
            </transition>
        </div>
    </div>
    <script src="./node_modules/vue/dist/vue.min.js"></script>
    <script>
        var vm = new Vue({
            el: "#root",
            data: {
                isShow: false
            },
            methods: {
                changeShowStatus() {
                    this.isShow = !this.isShow;
                }
            }
        })
    </script>
</body>

```

- 动画组 `transition-group`