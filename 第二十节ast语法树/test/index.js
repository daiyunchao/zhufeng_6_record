let babel = require('@babel/core');
let t = require('babel-types');
const srouceCode = `const sum=(a,b)=>a+b;`

//这是babel转换的一个插件,插件就是一个对象
let transformArrowFunction = {
    //visitor:是源代码的访问器,可以帮我们捕获特定的节点
    visitor: {
        //我们想把箭头函数转换成普通函数,所以我们想要捕获的是箭头函数的表达式
        ArrowFunctionExpression: (path, state) => {
            //获取箭头函数这个对象
            let arrowNode = path.node;
            let id=path.parent.id;//path.node代表的当前节点,path.parent代表就是父节点
            //获取他的参数和方法体,方便复用
            let params = arrowNode.params;
            let body = arrowNode.body;

            //将箭头函数转换成普通函数
            //套路就是在网站
            //https://babeljs.io/docs/en/babel-types
            //中查询你想要生成的节点名称然后复制
            //创建一个普通函数节点
            //id:函数名
            //params:参数
            //body:函数体
            //generator 是否是generator的函数
            //async 是否是async的函数
            let generator=arrowNode.generator;
            let async=arrowNode.async;
            let functionExpress=t.functionExpression(id, params,
                //body有一点不一样,普通函数是代码块,所以要生成一个代码块节点,套路相同在https://babeljs.io/docs/en/babel-types
                //去查找
                t.blockStatement(
                    //body中有return,需要创建一个return的节点,文档上要求是一个数组
                    [t.returnStatement(body)]
                )
                , generator, async);

                //将原来的箭头函数代替成普通函数表达式
                path.replaceWith(functionExpress)
        }
    }
}

//开始转换
let result=babel.transform(srouceCode,{
    //转换时需要插件
    plugins:[transformArrowFunction]
})

console.log(result.code);
//const sum = function sum(a, b) {\n  return a + b;\n};