### AST语法树
- ast抽象语法树 可以通过程序`javascript parser`将代码转换成抽象语法树(ast)
```javascript
//使用https://esprima.org/demo/parse.html# 在线解析
var name='zhangsan';
//的结果:
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclaration",
            "kind": "var",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "name"
                    },
                    "init": {
                        "type": "Literal",
                        "value": "zhangsan",
                        "raw": "'zhangsan'"
                    }
                }
            ]
        }
    ],
    "sourceType": "script"
}
```

- 使用ast可以干嘛? 将源代码进行解析解析成 ast语法树,遍历这个树,修改节点的值,重新生成新的树
- 转换ast的第三方库 `esprima(将源代码生成ast) estraverse(遍历ast语法树) escodegen(重新生成源代码)` 在线解析的网址: https://astexplorer.net/
- 使用`babel`转换源代码 使用到的库`@babel/core(生成ast,遍历语法树,转换) babel-types(用于创建新的节点类型或是判断节点类型)`
- `babel`的转换过程就是使用`ast`解析语法,修改源代码,在输出新的代码的过程
- 使用代码模拟`babel-plugin-transform-es2015-arrow-functions(将箭头函数转换成普通函数的plugin)`
```javascript
//babel-plugin-transform-es2015-arrow-functions 实现的功能类似于
//将:
let sum(a,b)=>a+b;
//转换成:
let sum()=function(a,b){return a+b;}
//的过程

```

```javascript
//自己实现的过程:
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
```

- 利用ast的三个核心步骤 
  1. 将源代码转换成ast语法树
  2. 解析ast语法树转换成想要生成的代码+
  3. 代替

- 将源代码转换成ast语法树的步骤
  1. 分词 将`var ast='is tree'`分词成 `关键字(var)` `标识符(ast)` `等于(=)` `字符串(is tree)` 这5个token
```javascript
//解析sourceCode
//希望将sourceCode转换成
//模拟解析过程:
let tokens = [
    { type: "KeyWord", value: "let" },
    { type: "WhiteSpace", value: " " },
    { type: "Identifier", value: "name" },
    { type: "Equal", value: "=" },
    { type: "String", value: "zhangsan" }
]
let sourceCode = `let name='zhangsan'`
let newTokens = [];
for (let i = 0; i < sourceCode.length; i++) {
    let ch = sourceCode.charAt(i);
    //判断类型
    //简化关键字和标识符只能是字母
    //可能是关键字或是标识符
    console.log("ch===>", ch, /\s/.test(ch));
    if (/[a-z]/.test(ch)) {
        let token = { type: "Identifier", value: ch }
        //这个循环只是寻找 关键字/标识符
        //循环的目的是找接下来连续的字符,判读是否满足要求
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (/[a-z]/.test(ch)) {
                //满足要求,是连续的字母
                token.value += ch;
            } else {
                //如果不满足呢,说明标识符或是关键字已结束
                //寻找标识符或是关键字的任务已结束
                if (token.value === 'let' || token.value === 'var') {
                    token.type = "KeyWord";
                }
                newTokens.push(token);
                break;
            }
        }
        i--;
        continue;
    } else if (/\s/.test(ch)) {
        //空格可能有多个,所以需要连续找
        let token = { type: "WhiteSpace", value: ch };
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (/\s/.test(ch)) {
                //如果还是空格说明是连续空格
                token.value += ch;
            } else {
                //空格结束
                newTokens.push(token);
                break;
            }
        }
        i--;
        continue;
    } else if (/[=]/.test(ch)) {
        let token = { type: "Equal", value: ch };
        newTokens.push(token);
    } else if (ch == '"' || ch == "'") {
        //如果是双引号或是单引号 说明是字符串
        let token = { type: "String", value: ch };
        newTokens.push(token);
        for (i++; i < sourceCode.length; i++) {
            ch = sourceCode.charAt(i);
            if (ch == '"' || ch == "'") {
                //匹配结束
                token.value += ch;
                break;
            } else {
                //匹配还在有
                token.value += ch;
                
            }
        }
        // i--;
        continue;
    }
}
console.log("newTokens==>", newTokens);

```


