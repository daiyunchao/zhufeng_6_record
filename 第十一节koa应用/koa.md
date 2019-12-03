### KOA应用

- 最基本的使用方法:
```javascript

const Koa =require('koa');
let app=new Koa();

//挂载中间件
app.use((ctx,next)=>{

})

//添加监听
app.listen(3000)
```
#### 中间件
- 中间件的特点:
  1. 可以添加到公共属性中
  2. 可以做权限判断


- 使用koa 获取post提交上来的请求体数据
```javascript
const Koa = require('koa')
const app = new Koa();
const fs = require('fs')
app.use(async (ctx, next) => {
if (ctx.path == '/login' && ctx.method == 'GET') {
  ctx.set('Content-Type', 'text/html;charset=utf-8');
  ctx.body = fs.createReadStream('./form.html');
} else {
  return await next();
}
});

app.use(async (ctx, next) => {
if (ctx.path == '/login' && ctx.method == 'POST') {
  //这里一定要封装成Promise才能实现效果
  //因为 on data on end 都是异步方法,如果不是promise 不会被await到
  return new Promise((reslove, reject) => {
    let arr = [];
    ctx.req.on('data', function (chunk) {
      arr.push(chunk);
    });

    ctx.req.on('end', function () {
      ctx.set('Content-Type', 'text/html;charset=utf-8');
      ctx.body = Buffer.concat(arr);
      reslove();
    })
  })
}
})
app.listen(3000)
  ```
- 上面的代码 库`koa-bodyparse`已经提供 原理是是相同的

```javascript
//使用bodyparser:
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const fs = require('fs')
app.use(bodyParser())
app.use(async (ctx, next) => {
  if (ctx.path == '/login' && ctx.method == 'GET') {
    ctx.set('Content-Type', 'text/html;charset=utf-8');
    ctx.body = fs.createReadStream('./form.html');
  } else {
    return await next();
  }
});

app.use(async (ctx, next) => {
  if (ctx.path == '/login' && ctx.method == 'POST') {
    ctx.body = ctx.request.body;
  }
})
app.listen(3000)
```

```javascript
//不使用bodyparser,自己实现一个中间件来实现相同的功能
const Koa = require('koa')
const app = new Koa();
const fs = require('fs')
const querystring=require('querystring')
//全部的中间件都需要是async await的
function bodyParser() {
  return async function (ctx, next) {
    await new Promise((reslove, reject) => {
      let arr = [];
      ctx.req.on('data', function (chunk) {
        arr.push(chunk);
      });

      ctx.req.on('end', function () {
        ctx.request.body =querystring.parse(Buffer.concat(arr).toString());
        reslove();
      })
    })
    await next();
  }
}
app.use(bodyParser())
app.use(async (ctx, next) => {
  if (ctx.path == '/login' && ctx.method == 'GET') {
    ctx.set('Content-Type', 'text/html;charset=utf-8');
    ctx.body = fs.createReadStream('./form.html');
  } else {
    return await next();
  }
});

app.use(async (ctx, next) => {
  if (ctx.path == '/login' && ctx.method == 'POST') {
    ctx.body = ctx.request.body;
  }
})
app.listen(3000)
```
