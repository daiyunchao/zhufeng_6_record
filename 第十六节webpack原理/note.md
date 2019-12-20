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

