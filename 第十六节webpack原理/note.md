### WEBPACK原理

- 预备知识点
  1. toStringTag `Symbol.toStringTag`是一个内置`symbol`, 用于修改对象调用toString的结果的
```javascript
Object.prototype.toString.call({name:"zhufeng"});//[object Object]
Object.prototype.toString.call([]);//[object Array]
Object.prototype.toString.call(10);//[object Number]
Object.prototype.toString.call(true);//[object Boolean]

//原来一个对象的toString的结果是 [object Object]
//我们可以使用 toStringTag去修改这个值

let userExports={};
object.defineProperty(userExports,Symbol.toStringTag,{value:"Module"})
Object.prototype.toString(userExports)//[object Module]

```
  2. `Object.create(null)` 创建一个干净的没有任何属性的对象
```javascript
Object.create=function(proto){
    function F(){};
    F.prototype=proto;
    return new F();
}
```
  3. `Object.defineProperty` 定义属性
```javascript
let val;
let obj={};
Object.defineProperty(obj,'value',{
    //定义getter
    get(){
       return val; 
    },
    //定义setter
    set(newVal){
        val=newVal;
    }
})
```
- webpack的生成结构
  1. 生成好的文件是一个自执行函数 将模块当成参数传递给自动执行函数
```javascript
  (function(modules) { // 自执行函数
 	// 模块的缓存
 	var installedModules = {};

 	// 自己创建了一个 requre的方法去加载模块(这就是为什么webpack可以认识node的require module.export的原因)
 	function __webpack_require__(moduleId) {

 		// 检查缓存是否存在,如果存在就直接返回缓存中的exports
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// 如果缓存不存在,就创建一个对象 放入缓存中
 		var module = installedModules[moduleId] = {
 			i: moduleId,//模块的ID
 			l: false,//是否加载过
 			exports: {}//模块导出的对象
 		};

 		// 开始执行这个模块
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// 是否加载过修改成 已加载
 		module.l = true;

 		// 返回执行模块的exports
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// create a fake namespace object
 	// mode & 1: value is a module id, require it
 	// mode & 2: merge all properties of value into the ns
 	// mode & 4: return value when already ns object
 	// mode & 8|1: behave like require
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
 })
/************************************************************************/

//参数
 ({

/***/ "./src/index.js"://ID
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided *///模块对应的一个函数
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _test_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test.js */ \"./src/test.js\");\n\r\nconsole.log(\"this is indexjs\");\r\nObject(_test_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/test.js":
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction mytest() {\r\n    console.log(\"this is test js\");\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (mytest);\r\n\r\n\n\n//# sourceURL=webpack:///./src/test.js?");

/***/ })

 });
```
- 手写bundle.js
```javascript
(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        
        return module.exports;
    }

    //执行入口文件:
    __webpack_require__("./src/index.js");
})({
    "./src/index.js": (function (module, exports, __webpack_require__) {
        let test = __webpack_require__("./src/test.js");
        console.log("this is indexjs");
        test();
    }),
    "./src/test.js": (function (module, exports, __webpack_require__) {
        
        function mytest() {
            console.log("this is test js");
        }
        module.exports = mytest;
    })
})
```

- 异步导入`import()`方式 该方式的引用文件的方式是通过jsonp的方式创建一个script标签动态的获取js文件
```javascript
//大概的原理:
//这是我写的特别简化版
(function (modules) {
    var installedChunks = { "main": 0 };
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    function push_module(data) {
        var chunkIds = data[0];
        var moreModules = data[1];

        for (const module in moreModules) {
            modules[module] = moreModules[module];
        }
        for (let index = 0; index < chunkIds.length; index++) {
            const chunkId = chunkIds[index];
            installedChunks[chunkId][0]();
            installedChunks[chunkId] = 0;
        }
    }
    __webpack_require__.r = function () { };
    __webpack_require__.e = function (chunkId) {
        let promise = new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = chunkId + ".bundle.js"
            document.head.appendChild(script);
            installedChunks[chunkId] = [resolve, reject];
            //jsonpArray=window["webpackJsonp"]=[];
            var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
            jsonpArray.push = push_module;
        })
        installedChunks[chunkId][2] = promise;
        return promise;
    }
    //执行入口文件:
    __webpack_require__("./src/index.js");
})({
    "./src/index.js": (function (module, exports, __webpack_require__) {
        console.log("this is indexjs");
        setTimeout(() => {
            // import(/*webpackChunkName: test*/'./test.js').then((data) => {
            //     console.log(data.default);
            // });
            eval("console.log(\"this is indexjs\");\r\nsetTimeout(() => {\r\n    __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./test.js */ \"./src/test.js\")).then((data) => {\r\n        console.log(data.default);\r\n    });\r\n}, 2000);\r\n\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
        }, 2000);
    }),
})
```

### webpack loader
- loader其实就是一个函数
```javascript
//模仿 babel-loader
const babel=require('@babel/core');

//参数: source:需要转换的资源内容
//this.request 格式为 loader1!loader2!loader3!index.js
function loader(source,sourceMap){
    const options={
        presets:["@babel/preset-env"],
        inputSourceMap:sourceMap,
        sourceMap:true,//告诉webpack 需要输出webpack
        filename:this.request.split('!').pop(),//打包后的文件名 
    }

    //交给babel去转换
    //code:转换后的源代码
    //map:mapsource
    //ast:抽象语法树
    let {code,map,ast}=babel.transform(source,options);

    //回调
    this.callback(null,code,map,ast)
}
module.exports=loader; 

//如果我们自定义了loader,如何在webpack中使用呢?

//webpack.config.js
resolveLoader:{
    //方式1.alias
    alias:{
        //loader的名称-对应的路径
        "babel-loader":path.join(__dirname,'xxxxx/xxx/xx.js')
    },

    //方式2.module,适合有多个loader的情况
    modules:[path.join(__dirname,'loader的文件夹'),'node_modules']
},
module:{
    rules:[
        {
            test:/\.js$/,
            use:['babel-loader'],//当webpack使用到babel-loader的时候,会通过resolveloaders去找loader
        }
    ]
}
```

- webpackloader的加载顺序
  1. 如果loader中没有pitch函数,或pitch函数没有返回值,loder的执行顺序是从右向左执行
  2. 如果pitch函数中有返回值 就会顺序走pitch函数,直到走完全部loader的pitch在逆向执行loader函数(自己的loader是不会执行的)
```javascript
//例子1:没有pitch函数的loader
//现在假如有3个自定义的loader是这样的
function loader1(source){
    return source+"//1"
}
module.exports=loader1;

function loader2(source){
    return source+"//2"
}
module.exports=loader2;

function loader3(source){
    return source+"//3"
}
module.exports=loader3;

//有 index.js 入口文件是这样的
console.log("this is index js");

//webpack的配置是:
module:{
    rule:/\.js$/,
    use:['loader1','loader2','loader3']
}
//执行webpack打包打印出来的源代码是
console.log("this is index js")//3//2//1

//可以看到在没有pitch函数的loader中,执行的顺序是 逆向执行的

```

```javascript
//例子2:有pitch函数时候

function loader1(source){
    return source+"//1"
}
loader1.pitch=function(){
    return "pitch1"
}
module.exports=loader1;

function loader2(source){
    return source+"//2"
}
loader2.pitch=function(){
    return "pitch2"
}
module.exports=loader2;

function loader3(source){
    return source+"//3"
}
loader2.pitch=function(){
    return "pitch3"
}
module.exports=loader3;

//有 index.js 入口文件是这样的
console.log("this is index js");

//webpack的配置是:
module:{
    rule:/\.js$/,
    use:['loader1','loader2','loader3']
}
//执行webpack打包打印出来的源代码是
// pitch3//2//1
//可以发现 如果有pitch函数,则会执行pitch函数,当顺序的执行完pitch函数后(或遇到后一个pitch函数没有返回值)再跳过自己的loader方法逆向的执行loader函数 并且pitch函数的返回值成了下一个loader的source参数

```

```javascript
//例子3:只有部分pitch函数
//例子中的loader3没有pitch函数
function loader1(source){
    return source+"//1"
}
loader1.pitch=function(){
    return "pitch1"
}
module.exports=loader1;

function loader2(source){
    return source+"//2"
}
loader2.pitch=function(){
    return "pitch2"
}
module.exports=loader2;

function loader3(source){
    return source+"//3"
}

module.exports=loader3;

//有 index.js 入口文件是这样的
console.log("this is index js");

//webpack的配置是:
module:{
    rule:/\.js$/,
    use:['loader1','loader2','loader3']
}
//执行webpack打包打印出来的源代码是
// pitch2//1
//可以发现 如果有pitch函数,则会执行pitch函数,当顺序的执行完pitch函数后(或遇到后一个pitch函数没有返回值)再跳过自己的loader方法逆向的执行loader函数 并且pitch函数的返回值成了下一个loader的source参数

```

- loader的类型 post(后置) inline(内联) normal(正常) pre(前置)
  