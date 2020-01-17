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