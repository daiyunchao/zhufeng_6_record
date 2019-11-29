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
app.listen(3001);
app.listen(3002);