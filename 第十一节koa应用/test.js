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