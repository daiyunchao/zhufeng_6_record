const Koa = require('koa')
const app = new Koa();
const fs = require('fs')
const querystring = require('querystring')
const path = require('path')
const uuid = require('uuid')
const mime = require('mime')
//扩展一个buffer的split方法,用于解析请求体中的buffer
Buffer.prototype.split = function (sep) {
  let len = Buffer.from(sep).length; // 分割符的长度
  let offset = 0;
  let result = [];
  let current;
  // 把找到的位置赋给current  看一下是否为-1
  while ((current = this.indexOf(sep, offset)) !== -1) {
    result.push(this.slice(offset, current)); // 把每次的记过push到数组中
    offset = current + len // 增加查找偏移量
  }
  result.push(this.slice(offset)); // 最后一段追加进去
  return result;
}

//全部的中间件都需要是async await的
function bodyParser() {
  return async function (ctx, next) {
    await new Promise((reslove, reject) => {
      let arr = [];
      ctx.req.on('data', function (chunk) {
        arr.push(chunk);
      });

      ctx.req.on('end', function () {
        let contentType = ctx.get('Content-Type');
        if (contentType.includes("form-data")) {
          //如果是formdata类型,只能解析请求体,因为可能里面的内容不是字符串,而是buffer
          let data = Buffer.concat(arr);
          let spe = contentType.split('=')[1];
          //构建完整的用户分隔符:
          spe = "--" + spe;
          // console.log("data===>", data);

          //拆分数据,去掉一头一尾的数据
          let datas = data.split(spe).slice(1, -1);
          let requestBody = {};
          datas.forEach((item) => {
            let [header, content] = item.split('\r\n\r\n');
            let isFile = true;
            header = header.toString();
            isFile = header.includes('filename');
            let key = header.match(/name="(.+?)"/)[1];
            console.log("header==>", key);
            content = content.split('\r\n')[0].toString();
            if (!isFile) {
              //普通字符  
              requestBody[key] = content;
            } else {
              //文件字符
              //保存文件
              let filename = uuid.v4()
              fs.writeFileSync(path.join(__dirname, 'uploads', filename), content, 'utf8');
              requestBody[key] = filename;
            }
          });
          ctx.request.body = requestBody;
          reslove();
        } else {
          //如果是其他类型,则可直接转换成字符串的形式
          ctx.request.body = querystring.parse(Buffer.concat(arr).toString());
        }
        reslove();
      })
    })
    await next();
  }
}
function static(dirpath) {
  return async function (ctx, next) {
    console.log("111222",ctx.path);
    
    try {
      let routerpath = ctx.path;
      let filepath = path.join(__dirname, dirpath,routerpath);
      let stat = fs.statSync(filepath);
      if (stat.isFile()) {
        let type = mime.getType(filepath);
        ctx.set('Content-Type', `${type};charset=utf-8`)
        ctx.body = fs.createReadStream(filepath);
      } else {
        filepath += "/index.html";
        stat = fs.statSync(filepath);
        let type = mime.getType(filepath);
        ctx.set('Content-Type', `${type};charset=utf-8`)
        ctx.body = fs.createReadStream(filepath);
      }
    } catch (e) {
      return await next();
    }
  }
}

app.use(bodyParser())
app.use(static("./uploads"))
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