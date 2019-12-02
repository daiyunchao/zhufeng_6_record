const Koa = require('./application');
let app = new Koa();
app.use(async (ctx, next) => {
  console.log("1");
  await next();
  ctx.body = {"name":"zhangsan"};
  console.log("2");
})
app.use(async (ctx, next) => {
  console.log("3");
  await next();
  console.log("4");
})
app.use(async (ctx, next) => {
  console.log("5");
  await next();
  console.log("6");
})
app.use(async (ctx, next) => {
  console.log("7");
  await next();
  console.log("8");
})
app.listen(3000);