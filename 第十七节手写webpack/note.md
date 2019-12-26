### 手写webpack

- webpack的执行流程
1. 初始化参数:从配置文件(webpack.config.js)和shell(命令行参数如: package.json中的 --env --config)进行合并,得出最终的参数
2. 开始编译,用上一步得到的参数初始化 `compiler`对象,加载所有配置的插件,执行对象的`run`方法开始执行编译;确定入口(配置文件中的entry)住处所有的入口文件
3. 编译模块,从入口文件出发,调用所有配置的`loader`,对模块进行编译,再找出模块的依赖模块,再递归本步骤知道所有入口依赖的文件都经过了本步骤的处理;
4. 完成编译,在经过了递归的编译后,得到了每一个模块被编译的内容以及它们之间的依赖关系
5. 根据入口和模块之间的关系,组织成一个个包含多个模块的`Chunk`,再把每个`Chunk`转换成一个单独的文件加入到输出列表,这一步是修改输出内容的最后机会
6. 输出完成,在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统(output)

> 在以上过程中,`webpack`会在特点的时间点广播出特定的事件,插件在监听到感兴趣的事件后悔执行特定的逻辑,并且插件可以调用webpack提供的api改变webpack的运行结果(plugins)

- 使用node 调用webpack打包
```javascript
const path = require('path')
const webpack = require('webpack');//webpack
const config = require('./webpack.config.js')//打包的配置文件
let compiler=webpack(config);
//调用compiler的run开始进行打包
compiler.run((err,state)=>{
console.log(state);//打包的结果
})

//打包结果中比较重要的几个字段:
modules 记录所有解析后的模块 
chunks 记录了所有的代码块 
assets 记录了所有要生成的文件

```

- webpack的核心 `tapable` 负责编译的 `Compiler`和负责创建bundle的`Compilation`都是`tapable`的实例,tapable是一个hook的库

- tapable的分类 
  1. hook 类型可以分为 `同步sync` 和`异步async`,异步又分为 `并行`和 `串行`
  2. Basic基本类型, 不关心监听函数的返回值
  3. Bail保险式,只要函数有返回值,则跳过后面的监听函数
  4. Waterfall瀑布式,上一个的返回值是下一步的参数
  5. Loop 循环式, 如果监听函数返回的是true,则这个监听函数会反复执行,如果返回undefined则退出循环

```javascript
//webpack使用到的tapable的钩子
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,//Parallel 并行
	AsyncParallelBailHook,
	AsyncSeriesHook,//Series 异步
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```
```javascript
//SyncHook的基本用法
//两个核心方法,tap:注册事件 call:触发事件
let {SyncHook} =require('tapable');
const hook=new SyncHook();
hook.tap('zhangsan',()=>{log('zhangsan')})
hook.tap('lisi',()=>{log('lisi')})
hook.call(); //打印了 zhangsan lisi

//传递参数的写法:
let {SyncHook} =require('tapable');
//我希望在触发事件的时候传递一个 age参数 
const hook=new SyncHook(['age']);
hook.tap('zhangsan',(age)=>{log(`zhangsan ${age}`)})
hook.tap('lisi',(age)=>{log(`lisi ${age}`)})
hook.call(20); //打印了 zhangsan20 lisi20
```