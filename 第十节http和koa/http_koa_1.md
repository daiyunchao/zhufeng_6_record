### koa第一节

- koa的基本用法
```javascript
//使用koa启动一个服务器:
const Koa=require('koa')
const app=new Koa();
app.listen(3000);
 
 //使用koa处理请求

const Koa=require('koa')
const app=new Koa();

//ctx:当前上下文,是koa对 原http的req res 和koa自框架中的 request response的封装
//同时也代理了 req res request response
//所以原本 需要 ctx.request.path 现在只需要 ctx.path
app.use(ctx=>{
  console.log(ctx.path);
  
})
app.listen(3000)
```

#### koa request API列表


#### koa response API列表

#### koa中文官网笔记
- koa更小 没有中间件的捆绑
- koa 使用 async await 的语法糖 避免了回调地狱
- 联级 使用类似调用栈的方式
```javascript
const Koa = require('koa');
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  console.log("11");
  await next();
  console.log("22");
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  console.log("33");
  await next();
  console.log("44");
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  console.log("55");
  ctx.body = 'Hello World';
});

app.listen(3000);

//输出日志依次是: 11 33 55 44 22
```

- 一个koa的实例时可以监听多个端口的
```javascript
//这三个端口的请求都会到这个进程上来
app.listen(3000);
app.listen(3001);
app.listen(3002);

```
这样的好处就是 可以在一个进程上既启动启动http也启动https
```javascript

const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);

```

- 绑定中间件的方法 `app.use()`

- 为ctx添加属性,ctx一直会被携带 写作:`app.content.db` 使用:`ctx.db`

```javascript
//要从 ctx 添加对数据库的引用
app.context.db = db();
app.use(async ctx => {
  console.log(ctx.db);
});

```
- 监听错误
```javascript
app.on('error', err => {
  log.error('server error', err)
});
```

#### koa中的Context
- Context 是koa对 node request response的封装 每一个请求都会创建一个Context对象,但是为了方便ctx代理很request和response的方法
- 如:ctx.path ===ctx.request.path ctx.method===ctx.request.method
- 如:ctx.type===ctx.response.type ctx.length===ctx.response.length


```javascript
app.use(async ctx => {
  ctx; // 这是 Context
  ctx.request; // 这是 koa Request
  ctx.response; // 这是 koa Response
});

```

#### koa中的 context request response req res 之间的关系
- context 上下文 作用主要是代理了 request response req res 这里面的方法
- request koa 自己封装的请求方法
- response koa 自己封账的响应方法
- req 原生http的请求方法
- res 原生http的响应方法
   

