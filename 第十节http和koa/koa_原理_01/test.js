const Koa = require('./application');
let app = new Koa();
app.use(ctx => {
  //url:
  console.log("ctx request url2=>", ctx.request.url);
  console.log("ctx req url=>", ctx.req.url);
  console.log("ctx request req url=>", ctx.request.req.url);
  console.log("ctx url=>", ctx.url);


  //method:
  console.log("ctx request method=>", ctx.request.method);
  console.log("ctx req method=>", ctx.req.method);
  console.log("ctx request req url=>", ctx.request.req.method);
  console.log("ctx url=>", ctx.method);
})
app.listen(3000);