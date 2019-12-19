### webpack优化

- `purgecss-webpack-plugin` 优化css,将没用到的css样式去掉,但需要配合`mini-css-extra-plugin`
- 没被引用的样式会被删除(但是不见得全部会被删除)
```javascript
//用于获取文件路径的库
const glob=require('glob');
const PrugeCssWebpackPlugin=require('purgecss-webpack-plugin');

plugins:[
    new PrugeCssWebpackPlugin({
        paths:glob.sync('./src/**/*',{nodir:true})//指定需要优化的样式路径
    })
]
```
- `image-webpack-loader`压缩图片,可配合`file-loader`一起使用,具体使用例子在:https://www.npmjs.com/package/image-webpack-loader

- webpack配置的`externals`外部变量,这是为了有的库不用打包到大的js中,而是用的cdn,或是外部直接引用的方式 
```javascript
externals:{
    //格式'报名':'变量名'
    'jquery':'$'//这里的意思就是不去打包代码中的jquery
}
```

- `tree-sharking`webpack去掉无用代码特点:
  1. 只支持es的导入`import xx from xxx`类似这种
  2. 只能在生产环境下使用
```javascript
optimization:{
    //如果开启了该功能在生产环境中将会自动的去掉没有引用到的代码
    usedExports:true,//在打包的文件中会标记文件哪些被导出了,哪些被用到了`exports used:xxxx`
}

//有下面这段代码:
//test.js 
function test(){
    console.log("hello")
}
test();
export default test;

//index.js
import test from './test.js' //这段代码只是引用了,但没有使用到,叫着副作用代码

//这时候在生成代码,test会被当成是有意义的代码保留下来(因为内部执行了test方法)
//但是可能我们想删除这个只引用了但没使用的代码怎么办呢?
//在package.json中加入
sideEffects:true //就能删除这段代码了
//但设置了这个有一个问题 我们一般引用样式 import './index.css' 这样设置了就会被删除
//但是可以解决的, 
//1.将import 修改成require
//2.将sideEffects配置成一个数组
sideEffects:[
    "**/*.css"
]
```

- `scope-hoisting` 减少作用域 这是webpack4 自带的功能,在生成环境中自动会使用
```javascript
//a.js

let a=1;
let b=2;
let c=3;

let d=a+b+c;
export default d;

//index.js
import d from './a.js'
console.log(d)

//上面这段代码会被优化成
// import d from './a.js'
console.log(6)
```

- `dllPlugin`动态链接库 可以提升打包的速度

- webpack打包第三方库
```javascript
//打包 react react-dom

//index.js
import React from 'react'
import { render } from 'react-dom'
render(<h1>123</h1> , document.getElementById("root"))



//webpack.config.js
const path = require('path');

//引用库文件,在打包的过程中就会去查找配置的缓存文件,如果文件中有指定的库,就不会再打包了
const DllReferencePlugin = require('webpack').DllReferencePlugin;


//生成html
const HtmlWebpackPlugin = require('html-webpack-plugin')

//向html中添加标签(dll文件需要引用到html中,因为现在打包的文件中没有打包react)
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                'test': /\.js/,
                'use': {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        //指定缓存文件位置
        new DllReferencePlugin({
            manifest: path.join(__dirname, './dll/react-manifest.json')
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html'),
            filename: 'index.html'
        }),

        //添加第三方库到html中
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, './dll/react.dll.js'),
        }),
    ]
}


//webpack.dll.js
//打包第三方库 react 和react-dom
//将 react 和react-dom 生成一个文件
const path = require("path");
const DllPlugin = require('webpack').DllPlugin;
module.exports = {
    mode: "development",
    entry: ['react', 'react-dom'],
    output: {
        library: "react",
        filename: "react.dll.js",
        path: path.join(__dirname, "./dll")
    },
    plugins:[

        //使用这个会生成一个react-manifest.json的缓存文件
        new DllPlugin({
            name:'react',
            path:path.join(__dirname,'./dll/react-manifest.json')
        })
    ]
}
```

- 如何打包一个前端的包让nodejs使用呢
``` javascript
//创建了一个webpack.dll.js的webpack配置文件
const path = require("path")
module.exports = {
    mode: "development",
    entry: path.join(__dirname, "./src/calc.js"),
    output: {
        library: "calc",//打包成一个立即执行函数,这个函数的返回值被赋到calc这个变量上
        libraryTarget: "commonjs2",// 可以使用 var(默认值) commonjs commonjs2
        filename: "calc.js",
        path: path.join(__dirname, "./dll")
    }
}
```
