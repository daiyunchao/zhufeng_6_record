### vue组件

#### 组件的声明周期

- `vm.$mount()`挂载到页面,如果是空参数,则会将内容渲染到内存中
```javascript
//
//el:"#root"的功能等于同:
//vm.$mount(),没有参数的话,是将内容渲染到内存中
//拿到内存中渲染的内容,插入到我想要的html节点中
vm.$mount();
document.body.appendChild(vm.$el);

//或是直接等价于:
vm.$mount("#app");
```

- vue组件的生命周期和暴露的钩子函数

```javascript

var vm = new Vue({
            //创建前执行,一般可以在该函数中为vm添加一些特点属性
            //但该方法不能获取到vm的data这类的值,无法改变这些值
            beforeCreate() {
                //创建前,不能拿到data/methods等等

                //this这个this就是vm实例
                console.log(this, "beforeCreate");

            },

            //实例创建完成执行,
            //当执行到了该方法,说明vm这个实例已经产生了,数据已经被劫持了(添加了get set方法,能监控了) 同时computed属性也添加到了该实例中
            //不能获取到真实的dom元素,所以不能操作dom
            created() {
                //这个时候的this中就有data属性并且已赋值了
                console.log("created");
            },

            //该方法在beforeMount会被调用
            render() {

                console.log("render");

            },

            //挂载之前,该方法会调用render方法或是template属性(如果没有render方法,vue会将template转换成render方法)
            beforeMount() {
                console.log("beforeMount");
            },

            //当前组件挂载完成,组件已经挂载到了html中
            //在该函数中就能拿到真实的dom元素
            //该方法调用结束后,挂载的流程就完成了
            mounted() {

            },

            //数据(data)更新了,视图更新之前被执行
            //如果视图没变(该数据没显示到页面上),该方法是不会执行的
            beforeUpdate() {

            },

            //更新完成,尽量不要在该函数中更新数据,更新数据可能会导致死循环
            updated() {

            },

            //销毁前,当路由改变或是手动销毁的时候会被调用到
            //手动调用的方法:vm.destory()
            beforeDestory() {
                //
            },

            //销毁完成
            destoryed() {

            }

        });

        //手动销毁监听,该监听会移除监听事件,让数据变化不会导致ui的变化(但并不会将页面上的内容移除掉)
        vm.destory();
```

#### 组件

- 创建全局组件
```html
<body>
    <div id="root">
        <My></My>
    </div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
        //创建一个全局组件My
        Vue.component('My', {
            template: `<div>this is something</div>`,
             data(){
                return {}
            }
        })
        var vm = new Vue({
            el: "#root"
        });

    </script>
</body>

   <script>
       //将组件注册成全局组件的方法:
        let component = {
            template: `<div>this is something</div>`
        }

        //将组件注册成全局组件
        Vue.component('My', component)
        var vm = new Vue({
            el: "#root"
        });
   </script>
```

- 创建局部组件
```javascript
 let component = {
            template: `<div>this is something</div>`
        }

        var vm = new Vue({
            el: "#root",
            //将component注册到vm这个vue的实例中,
            //那么该组件只能在vm这个实例的template中使用(该vm的template就是id=root的div)
            components: {
                "My": component
            }
        });
```

- 父子组件的通讯 `props`
```html
<body>
    <div id="root">
        <!-- 在子组件中添加一个属性 -->
        <My :q="q"></My>
    </div>
    <script src="./node_modules/vue/dist/vue.js"></script>
    <script>
        let component = {
            //使用这个props
            template: `<div>this is something{{q}}</div>`,
            //声明一个props,
            //如果使用数组的方式只是将属性添加到当前的实例中,方便使用
            //props:["q"],

            //使用对象的方式,可以验证props的类型等
            props:{
                q:{
                    type:Number,//验证父组件传递过来的属性是否是number类型的
                    required:true,//是否必填
                    default:100 //默认值,如果默认值是数组或是对象时要注意: 只能写成 default:()=>[1,2,3]这种形式,对象应该是 default:()=>({a:1})
                }
            }
        }

        var vm = new Vue({
            el: "#root",
            data(){
                return {
                    "q":100
                }
            },
            //将component注册到vm这个vue的实例中,
            //那么该组件只能在vm这个实例的template中使用(该vm的template就是id=root的div)
            components: {
                "My": component
            }
        });
    </script>
</body>
```

#### 组件之间的通讯

快速开发工具(在vue中使用vue-cli启动服务):
- 安装工具 
1. npm install @vue-cli@3 -g
2. npm install @vue/cli-service-global@3 -g (不用创建项目使用单文件运行文件)

- 创建`main.js`文件
```javascript
import Vue from 'vue'
import App from './App'

//创建一个vue的实例
new Vue({
    el:"#app",
    render:h=>h(App)//渲染App文件
})
```

- 创建`App.vue`文件
```javascript
<template>
    <div>this is cli-service-global</div>
</template>
```
- 在命令行中输入 `vue serve`就会启动一个服务,直接访问就能看到渲染好的`this is cli-service-global`页面
- `cli`是通过文件夹中去寻找`main.js`文件去执行并渲染
- 如果没有`main.js`也会直接渲染`App.vue`文件


- 组件之间的引用

`App.vue`组件引用`parent.vue`组件
```html
<template>
  <div>
    this is cli-service-global
    <!-- 使用组件 -->
    <Parent></Parent>
  </div>
</template>
<script>
    //引用组件
import Parent from "./components/Parent";
export default {
    //注册组件
  components: {
    Parent
  }
};
</script>
```
- 父组件传递给子组件数据
```html
<!-- Parent.vue -->
<template>
  <div>
    Parent Name:{{name}}
    <!-- 传递参数 -->
    <!-- 给子组件绑定一个change事件,等待子组件去触发该事件 -->
    <!-- 就像父亲给儿子一个锦囊,并且告诉儿子当你遇到啥事情的时候打开他 -->
    <!-- vm.$on('change',changeName) 是实现原理,也就是父组件其实添加了一个监听 -->
    <Son1 :parentName="name" @change="changeName"></Son1>
  </div>
</template>

<script>
import Son1 from "./Son1";
export default {
  components: {
    Son1
  },
  data(){
      return {
          "name":"zhangsan"
      }
  },
  methods:{
      changeName(newValue){
          this.name=newValue;
      }
  }
};
</script>

<!-- Son1.vue -->
<template>
    <!-- 使用参数 -->
    <div>
    Son1,His ParentName is :{{parentName}}
    <!-- 子组件修改父组件的属性 -->
    <button @click="changeMyData()">修改数据</button>
    </div>
</template>
<script>
export default {
    props:{
        parentName:{
            type:String,
            required:true,
        }
    },
    methods:{
        changeMyData(){
            //当儿子真的遇到事情的时候,打开锦囊,里面是处理方法
            this.$emit('change','lisi');
        }
    }
}
</script>
```
> 单向数据流,在上面例子中为什么子组件不能直接修改父组件的数据呢? 为什么只有从上级向下修改数据呢? 这就是vue或是react的单向数据流,有什么好处呢? 当我父级的数据改变了,无论传递了多少层值都是最新的.
  

- 三级数据传递和数据修改
```html
<!-- Parent.vue -->
<template>
  <div>
    Parent Name:{{name}}
    <!-- 给子组件绑定一个change事件,等待子组件去触发该事件 -->
    <!-- 就像父亲给儿子一个锦囊,并且告诉儿子当你遇到啥事情的时候打开他 -->
    <Son1 :parentName="name" @change="changeName"></Son1>
  </div>
</template>

<script>
import Son1 from "./Son1";
export default {
  components: {
    Son1
  },
  data(){
      return {
          "name":"zhangsan"
      }
  },
  methods:{
      changeName(newValue){
          this.name=newValue;
      }
  }
};
</script>


<!-- Son.vue -->
<template>
  <div>
    Son1,His ParentName is :{{parentName}}
    <Suen :name="parentName" @change="changeMyData"></Suen>
    <button @click="changeMyData()">修改数据</button>
  </div>
</template>
<script>
import Suen from "./Suen";
export default {
  components: {
    Suen
  },
  props: {
    parentName: {
      type: String,
      required: true
    }
  },
  methods: {
    changeMyData(newName="lisi") {
      //当儿子真的遇到事情的时候,打开锦囊,里面是处理方法
      this.$emit("change",newName);
    }
  }
};
</script>


<!-- Suen.vue -->
<template>
  <div>
    this is 孙子 收到的name是:{{name}}
    <button @click="changeMyData()">修改数据</button>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    }
  },
  methods: {
    changeMyData() {
        //一层一层传递的方法,只触发父组件的事件,其他的事情让父组件自己去做
      this.$emit("change", "wangwu");

      //另外一种方式,直接触发父组件的change事件,但这有个问题,这会导致组件不独立,他需要知道他的父组件绑定了什么事件
      //this.$parent.$emit("change",'wangwu');
    }
 }
};
</script>
```

- 越级执行event
```js
      //越级执行event:
      //在main.js中实现该方法,寻找祖节点挂载的事件,如果有就执行,没有就继续找 调用方法是: this.$dispatch('change','wangwu');
        Vue.prototype.$dispatch = function (eventName, parmater) {
            let parent = this.$parent;
            while(parent){
                parent.$emit(eventName,parmater);
                parent=parent.$parent;
            }
        }
```

- 父组件执行子组件的方法
```javascript
this.$refs.child.callMethod();
```

- `update.sync语法糖`
```html
<template>
  <div>
    Parent Name:{{name}}
    <!-- 给子组件绑定一个change事件,等待子组件去触发该事件 -->
    <!-- 就像父亲给儿子一个锦囊,并且告诉儿子当你遇到啥事情的时候打开他 -->

    <!-- 版本1 -->
    <!-- 绑定update方法时,可以绑定一个方法 -->
    <!-- <Son1 :parentName="name" @update:name="changeName"></Son1> -->

    <!-- 版本2 -->
    <!-- 也可以直接将函数体直接写在这 -->
    <Son1 :parentName="name" @update:name="newValue=>this.name=newValue"></Son1>

    <!-- 版本3 update语法糖 既表示传递了参数:parentName也表示@update:parentName="newValue=>this.name=newValue" -->
    <Son1  :parentName.sync="name"></Son1>

    <!--版本4 使用v-model  -->
    <!-- <Son1  :value="name" @input="newValue=>this.name=newValue"></Son1> -->
    <Son1  v-model="name"></Son1>
    <!-- v-model 翻译出来的代码是 :value="name" @input="newValue=>this.name=newValue" -->
    <!-- 说明v-model只能是固定写法,并且只能使用一个,并且触发的方法必须是this.$emit('input','newValue') 一个表达式中不能出现两个v-model,但update.sync的方式就很随意-->
  </div>
</template>

<script>
import Son1 from "./Son1";
export default {
  components: {
    Son1
  },
  data(){
      return {
          "name":"zhangsan"
      }
  },
  methods:{
      changeName(newValue){
          this.name=newValue;
      }
  }
};
</script>

<!-- Son.vue -->
<template>
  <div>
    Son1,His ParentName is :{{parentName}}
    <button @click="changeMyData()">修改数据</button>
  </div>
</template>
<script>
export default {

  props: {
    parentName: {
      type: String,
      required: true
    }
  },
  methods: {
    changeMyData(newName="lisi") {
        //使用:parentName.sync语法糖,但触发的事件名称还必须是 update:xxxx的方式
       this.$emit("update:parentName",newName);
    }
  }
};
</script>
```

- `$attrs`属性的集合,传递数据不声明时获取
```html
<!-- 在Son中传入了两个属性 name和age -->
<!-- 如果子子组织中没有定义props属性会出现在html标签中 -->
 <Son1 :name="name" :age="age"></Son1>

 <template>
  <div>
    Son1,His ParentName is :{{parentName}}
    {{$attrs}}
  </div>
</template>
<script>
export default {
  //没有定义:props,可以获取$attrs
  //但当定义了props后(定义了一个就会在$attrs中少一个属性),属性就会从$attrs中删除掉,并且在标签中的属性也会被删除掉
  //可以利用这个特点只接受这个需要的属性,而把不用不到的属性直接传递给下一级
  //传递方式是
  //使用绑定的方式,和react传递剩余参数的方式相同,{...this.props}
  //<Suen v-bind="$attrs"></Suen>

  //如果定义了'inheritAttrs'属性为false,则就算没有props属性,html标签中也不会显示传过来的属性
  inheritAttrs:false,
  props:{
      name:{}
  }
};
</script>
```

- `@click.native`绑定原生事件
```html
 <!-- 这个click是绑定在组件中的,而不是click事件 -->
 <Son1 :name="name" :age="age" @click="show()"></Son1>

 <!-- 如何调用原生的click事件呢? 在click后添加.native表示这是click是原生的方法 -->
 <Son1 :name="name" :age="age" @click.native="show()"></Son1>
```

- `$listeners`事件集合
```html
<!-- 注册了两个事件  click mouseup-->
<Son1 :name="name" :age="age" @click="show()" @mouseup="show"></Son1>

<!-- 通过 $listeners获取全部注册的事件-->

<!-- Son.vue -->
<script>
//在挂载完成后打印该值:
mounted(){
    //获取到了全部注册到该组织的事件
      console.log(this.$listeners);
  }
</script>
<!-- 在子组件中如何将全部的注册事件向下传递-->
<!-- 传递全部属性使用 v-bind 传递事件使用 v-on -->
<Suen v-bind="$attrs" v-on="$listeners">
```

- `provide inject` 在父组件中声明公共数据,在子组件中注入 在父组件中通过`provide`声明全局变量,在跨级组件中使用`inject`注入到组件中使用,该方法会向父级通关名称的方式去查找,这种方式会有问题,如果全局变量是一个vue的对象呢,岂不是可以直接调用这个对象的方法? 
```html
<!-- App.vue -->
<template>
  <div>
    this is cli-service-global
    <Parent></Parent>
  </div>
</template>
<script>
//引用
import Parent from "./components/Parent";
export default {
    //使用provide声明了一个全局变量app=zhangsan
  provide() {
    return { app: "zhangsan" };
  },
  components: {
    Parent
  }
};


</script>

<!-- Son.vue -->
<template>
  <div></div>
</template>
<script>
export default {
    //使用inject注入到组件中
  inject: ["app"],
  mounted() {
      //使用这个全局变量
    console.log(this.app);
  }
};
</script>
```

- `$refs`获取子组件的实例,可以直接调用子组件的方法或是数据
```javascript
// 在父组件中声明了子组件的名称是son
<Son ref="son"></Son>
this.$refs.son.say()//可以直接调用子组件的方法
```

- `eventbus` 全局发布定义机制,该方法可以在任意的组件中注册($on),并且可以在任意的组件中响应($emit),可能会产生混乱,不知道这个数据因为什么原因导致变化的
```javascript
//main.js中

//创建一个vue将这个实例变成全局的,并且使用这个vue中的$on和$emit
Vue.prototype.$bus=new Vue();

//在任意组件中注册
this.$bus.$on('eventName',function(){})

//在任意的组件中触发
this.$bus.$emit('eventName','参数')
```

- `slot`插槽,填充内容的方式(在组织中声明一些插槽,在使用这个组件的时候再填充内容) default的默认插槽 有名字的就叫具名插槽
```html
<!-- Menu.vue -->
<template>
  <ul>
  <!-- 留着一个位置等待填充 -->
    <slot name="default"></slot>
  </ul>
</template>

<!-- MenuItem.vue -->
<template>
    <li></li>
</template>

<!-- App.vue -->
<template>
  <div>
    <Menu>
      <MenuItem></MenuItem>
      <MenuItem></MenuItem>
      <MenuItem></MenuItem>
    </Menu>
  </div>
</template>
<!-- 因为slot是default的所以直接放到Menu内就会当到插槽里面去,如果不是default的话则不会显示出来 -->
```
- 具名插槽的用法

```html
<!-- MenuSubItem.vue -->
<template>
  <ul>
  <!-- 注册了一个具名插槽,只有名称相同才会被放到这里面 -->
      <slot name="title"></slot>
  </ul>
</template>

<!-- App.vue -->
<template>
  <div>
    <Menu>
        <SubMenuItem>
        <!-- slot =xxx 就说明要使用哪一个插槽 -->
            <template slot="title">导航0</template>
            <!-- 剩余的这些组件内容会放到default的默认插槽中去 -->
            <MenuItem>导航二</MenuItem>
            <MenuItem>导航三</MenuItem>
        </SubMenuItem>
      <MenuItem>导航一</MenuItem>
      <MenuItem>导航二</MenuItem>
      <MenuItem>导航三</MenuItem>
    </Menu>
  </div>
</template>
```

- 组件的递归 在组件声明时给组件一个名称,就可以在这个组件同样使用这个组件 可以达到自己调用自己的目的
```html
<template>
  <ul>
    <slot name="default"></slot>
    <!-- 使用这个组件,达到自己调用自己的目的 -->
    <Menu></Menu>
  </ul>
</template>
<script>
export default {
  //添加了一个名字,就可以在组织内部使用自己了
    name:"Menu"
}
</script>
```

