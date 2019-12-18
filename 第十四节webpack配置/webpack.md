### WEBPACK 配置
- webpack是什么?
- webpack是js的静态模块打包器
- webpack-cli的作用是 解析用户输入的参数然后在传给webpack去打包 webpack4.0后成了一个必须品
- webpack-merge 用于合并配置文件的模块 为什么不用`object.assign`去合并呢?因为`assign`只能合并一层,但该模块循环合并
- webpack的核心内容
  1. 入口(entry)
  2. 输出(output)
  3. loader
  4. 插件(plugins)

- 安装 `yarn add webpack yarn add webpack-cli`
- webpack是既支持nodejs的模块语法(commonjs)也支持es6的模块语法(es6module)(这也就是,我们在前端中引用了node的模块使用require('xxx')webpack也认识)
- 使用webpack打包的两种方式
  1. 使用npx (npx是npm5.2版本后新增加的命令,用于执行node_modules/.bin/目录下的文件`npx webpack`)使用npx 可避免全局安装一些库
  2. 在package.json的scripts中添加执行命令 `build:webpack --mode production` (为什么在命令行中输入webpack 得到的结果是没有这个命令,但是在package.json中就能执行呢?? 原因是:我们在执行 npm run xxx时,它会把当前项目node_modules/.bin目录下的文件链接到全局中去(这样就能执行webpack命令了),但这只是一瞬间的,当执行完了后就取消了连接)

- webpack的默认配置文件 webpack.config.js webpack.file.js 因为webpack是基于nodejs的所以 webpack.config.js应该使用nodejs的语法 所以在根目录中添加文件`webpack.config.js`
```javascript
//最基本的使用方法: 导出一个对象
//问题: 如果是导出一个对象,则如果想区分 开发/产品 则可能会需要多个webpack的配置(可以在package.json中指定配置文件路径)
const path=require('path')
module.exports={
    //指定模式
    mode:'development'
    //入口文件
    entry:path.join(__dirname,'./src/index.js')
    //出口文件
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'main.js'
    }
}
```
- `webpack.config.js`导出一个函数
```javascript 
const path=require('path')
//导出一个函数
//要求: 这个函数必须返回一个webpack的配置 
//在package.json中配置: "start2":"webpack --env.development", "build":"webpack --env.production" 这样会将env传入配置函数中
//为环境传入多个参数: webpack --env.development --env.a xxxx
module.exports=(env)=>{
    console.log("env==>",env);
    
}
```

- 指定配置文件位置:
```javascript
//package.json文件中
scripts:{
    "start":"webpack --env.development --config ./config/webpack.base.js" //外挂env环境为:development 指定配置文件位置
}
```

- webpack-dev-server 开发服务器
```javascript
//最简单的使用
//在package.json中将webpack 代替成 webpack-dev-server 
scripts:{
    "start":"webpack-dev-server --config ./config.js"
}
```

- webpack-dev-server 如何配置
```javascript
const path=require('path')
module.exports={
    entry:path.join(__dirname,'./src/index.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:"index.js"
    },
    //配置devserver
    devServer:{
        port:3000
    }
}
```

- webpack的html打包插件 `html-webpack-plugin`
```javascript
let HtmlWebPlugin=require('html-webpack-plugin');
plugins:[
    new HtmlWebPlugin({
        template:path.join(__dirname,'../public'),
        filename:'index.html',
        //压缩文件
        minify:{
            removeAttributeQuotes:true,//去掉双引号
            collapseWhitespace:true,//将代码压缩到一行
        }
    })
]
```

- webpack 自动清除打包目录 `clean-webpack-plugin`



- 扩展: `publicPath` 和 `contentBase`

在 webpack的根`/output`有一个`publicPath`配置 在`devServer`中也有一个`publicPath`
区别:output中的publicPath:访问静态资源的路径，devServer中的publicPath影响资源在本地开发环境中的访问
一般将两个地方的output配置成相同的值
```javascript
//配置例子:
module.exports=  {
  dev:{
    ...,
    publicPath:"/assets/"
  },
  build:{
    publicPath:"https://csdn.cdn.cn/"
  }
}

module.exports = {
   entry:{
      ...
   },
   output:{
      ...,
      publicPath:process.env.NODE_ENV=='development'?config.dev.publicPath:config.build.publicPath
   }
}


```

- contentbase代表html页面所在的相对目录，如果我们不配置项，devServer默认html所在的目录就是项目的根目录
 配置: index.html在哪 contentbase就应该配置到对应的目录
- 这里需要注意一点，contentBase的路径是相对与webpack.config.js文件所在的目录的，有的时候，我们习惯将webpack配置文件统一放着一个build文件下，这个时候我们在写contentBase路径的时候就需要注意了
- 总结: 
  1. publicPath是访问静态资源的路径
  2. contentBase是用来指定被访问html页面所在目录的

- webpack 解析css的两个loader
  1. css-loader 识别css
  2. style-loader 将css插入到html的style标签中
  3. 如果要解析sass文件 需要安装 node-sass和sass-loader (webpack配置为 ['style-loader','css-loader','sass-loader'])
  4. 如果要解析less文件 需要安装less和less-loader
  5. 为css添加前缀 postcss-loader autoprefixer
  6. 避免css放到页面的style标签中可使用 `mini-css-extract-plugin`将样式进行抽离到单独的css文件中


```javascript
//在webpack配置中,loader的配置

//简单写法:
module:{
    rules:[
        {
            test:/.css$/,
            use:['style-loader','css-loader']
        }
    ]
}

//给loader传递参数
module:{
    rules:[
        {
            test:/.css$/,
            use:['style-loader',{
                loader:'css-loader',
                options:{
                    //这里放的css-loader的参数
                }
            }]
        }
    ]
}

//例子,如果我们在css文件中@import了一个sass文件在webpack中如何配置呢?
module:{
    rules:[
        {
            test:/.css$/,
            use:['style-loader',{
                loader:'css-loader',
                options:{
                    //这里放的css-loader的参数
                    //如果该文件中有@import样式,则使用下面[1]个来执行@import进来的文件
                    importLoaders:1
                }
            },'sass-loader']
        }
    ]
}


//mini-css-extract-plugin 使用例子:
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
module:{
    rules:[
        {
            test:/.css$/,
            
            use:[
                //使用MiniCssExtractPlugin.loader进行处理,style-loader是将全部的样式放到html的style标签中,所有使用新的loader代替
                MiniCssExtractPlugin.loader,{
                loader:'css-loader',
                options:{
                    //这里放的css-loader的参数
                    //如果该文件中有@import样式,则使用下面[1]个来执行@import进来的文件
                    importLoaders:1
                }
            },'sass-loader']
        }
    ]
}
plugins:[
    new MiniCssExtractPlugin({
        filename:'css/main.css'//打包到独立文件的文件名,可以是路径
    })
]
```

- webpack的优化项 `optimization`
- 如果需要压缩css文件可以在 `optimization`中使用`optimize-css-asserts-plugin`,但问题是如果使用了,js文件也需要手动压缩
- 如果需要压缩js文件可以在`optimization`中使用`terser-webpack-plugin`
```javascript
const OptimizeCssAssertsPlugin=require('optimize-css-asserts-plugin')
const TerserWebpackPlugin=require('terser-webpack-plugin')
mode:'xxxx',
optimization:{
    minimizer:[
        new OptimizeCssAssertsPlugin(),
        new TerserWebpackPlugin()
    ]
}
```

- webpack 处理文件的loader `file-loader` 自动拷贝文件 如果需要转换成base64 使用`url-loader` 

- webpack去转换js 主要会使用到的是babel
- `@babel/core` babel的核心模块
- `@babel/presets-env` 包含将es6转换成es5的全部包的集合(就是插件的集合)
- `babel-loader` 是webpack的loader
- 它们三者的关系是 webpack打包的时候使用 `babel-loader`去调用`@babel/core`去转换,而在`@babel/core`转换过程中也需要调用到`@babel/presets-env`
- 为什么babel7前面会有一个@? 是因为它使用了 `npm private scope` 将`@babel`变成了一个作用域,将它的相关库都放到了`@babel`作用域下,防止重名
-  `.babelrc`文件是干嘛的? `.babelrc`文件就是 `babel-loader`的`options`选项,如果觉得webpack.config文件中写的过多,则可以使用`.babelrc`文件进行分离
```javascript
//.babelrc文件示例:
//presets 中放的是插件的集合
//plugins 中放的是单个插件
{
    "presets":[
        "@babel/preset-env"
    ],
    "plugins":[

    ]
}
```
- `babelrc`文件中的 presets执行顺序是从下向上执行 而 plugins的执行顺序是从上向下执行的
- 在 babel7中 `babel-polyfill`已经废弃,代替它的方法是
```javascript
{
    "presets":[
        [
            "@babel/preset-env",{
                "useBuiltIns":"usage",//按需加载一些使用到的库
                "corejs":2,//使用corejs的版本二
            }
        ]
    ],
    "plugins":[

    ]
}
```
- `@babel/plugin-transform-runtime` 都以导入的方式使用Babel的帮助函数，而不是每个文件都复制一份帮助函数的代码
  1. 提高代码重用性，缩小编译后的代码体积
  2. 防止污染全局作用域。（启用corejs配置）

- `@babel/preset-typescript` 可以用于解析 `typescript`语法