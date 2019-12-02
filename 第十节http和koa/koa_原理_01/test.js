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
  console.log("ctx request req method=>", ctx.request.req.method);
  console.log("ctx method=>", ctx.method);

  //path:
  console.log("ctx request path=>", ctx.request.path);
  console.log("ctx path=>", ctx.path);

  //body:
  console.log("set ctx response body");
  ctx.body = 'zhangsan'
  console.log("get ctx response body=>", ctx.response.body);


})
app.listen(3000);