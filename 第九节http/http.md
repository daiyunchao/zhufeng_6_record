### http
- 请求和响应时一一对应的 
- 请求分为: 请求行 请求头 请求体
- 请求行(http1.1 )版本号
- 请求头(请求的头信息,Accept , Cache-Control 等等)
- 请求体(请求的参数,get为空)
- 响应分为:响应行 响应头 响应体
- 响应行(200 ok)
- 响应头(Accept , Cache-Control)
- 响应体(html 等 是服务器响应给客户端的具体内容)
- 对于node来说 request 是一个可读流 获取服务器端获取数据是使用 on('data') on('end')
- 对于node来说 response 是一个可写流 向浏览器返回数据使用 write方法 和 end方法 
- `curl` 是一个好工具,在windows上安装`git bash` 就能使用
- `nodemon` 监听文件变化实现自动重启
- 为了应对`url`的解析,`node`提供了`url`模块
#### 启动一个node服务器

```javascript
const http = require('http');
let server = http.createServer();
server.listen(3000, () => {
  console.log("ready listen 3000");

})
```

#### 一个完整的请求响应
```javascript
const http = require('http');
const nodeUrl = require('url')
let server = http.createServer((req, res) => {
  //req:请求对象 是一个可读流
  //res:响应对象 是一个可写流
  //req.url: 请求的url
  //使用url模块将url进行解析

  let urlObj = nodeUrl.parse(req.url, true)
  console.log("hostname==>", urlObj);//hostname
  console.log("pathname==>", urlObj.pathname);//不带参数的url
  console.log("query==>", urlObj.query);//参数对象

  //请求行:
  console.log("httpVesion===>", req.httpVersion);
  console.log("http url===>", req.url);

  //请求头:
  console.log("http header===>", req.headers);

  //请求体:
  let arr = [];
  req.on('data', function (chunck) {
    console.log("on data", chunck);
    arr.push(chunck);
  })

  req.on('end', function () {
    console.log("on end", Buffer.concat(arr).toString());
  })


  //响应行
  res.statusCode=200;

  //响应头
  res.setHeader('Content-Type','text/plain;charset=utf-8')

  //响应体:
  res.write('这是响应体')
  res.write('这是响应体2')
  res.write('这是响应体3')
  res.end();
});

server.listen(3000, () => {
  console.log("ready listen 3000");
})
```

#### 使用http发送请求
- 上面使用`http`的`http.createServer()`是创建一个`node`服务,用于接收客户端请求
- 也可以使用`http`的`get request`方法实现主动发起请求(我一般使用第三方库`request`)

```javascript

```

#### 服务器端是如何解析收到的请求体的呢?
- 如何获取这些数据是通过request端的`content-type`来的,服务器端通过`content-type`来区别传递上来的数据是哪种格式
- 如果是`application/json` 就使用`JSON.parse`
- 如果是`application/x-www-form-urlencoded`是表单格式,则可使用内置库`querystring`进行解析


```javascript
req.on('end', function () {
  //解析的例子:
    let data = Buffer.concat(arr).toString()
    console.log("on end", data);
    let contentType = req.headers["content-type"];
    if (contentType == 'application/json') {
      //如果是json
      console.log("收到json的参数是:", JSON.parse(data));

    } else if (contentType == 'application/x-www-form-urlcoded') {
      //如果是表单类型
      let querystring = require('querystring');
      console.log("收到form的参数是:", querystring.parse(data));
    } else {
      //如果是其他类型,如文本类型
      console.log("收到其他的参数是:", data);
    }
  })
```

#### 使用http服务器读取文件的例子(静态资源服务器)

```javascript
//请求服务器端的文件
const http = require('http')
const Url = require('url')//用于解析url中的pathname,知道访问的是哪个文件
const fs = require('fs')
const mime = require('mime')//用于确定返回文件的content-type
let path=require('path')
let server = http.createServer((req, res) => {

  //获取文件的名称
  let { pathname } = Url.parse(req.url);

  //找这个文件
  //1.如果有这个文件直接返回
  //2.如果这个目录是文件夹,则找下面的index.html
  //3.如果找不到这个文件 返回 404
  //4.如果是文件夹但文件夹中没有 index.html 返回404

  let filepath = path.join(__dirname, pathname);
  fs.stat(filepath, (err, stat) => {
    if (err) {
      //文件不存在
      res.statusCode = 404;
      return res.end('Not Found');
    }
    let isFile = stat.isFile();
    if (isFile) {
      //如果是文件,
      //直接返回
      res.statusCode = 200;
      let type = mime.getType(filepath);
      res.setHeader('content-type', `${type};charset=utf-8`);
      return fs.createReadStream(filepath).pipe(res);
    }
    filepath = path.join(filepath, 'index.html');
    fs.access(filepath, (err) => {
      if (err) {
        //文件不存在
        res.statusCode = 404;
        return res.end('Not Found');
      }
      res.statusCode = 200;
      let type = mime.getType(filepath);
      res.setHeader('content-type', `${type};charset=utf-8`);
      return fs.createReadStream(filepath).pipe(res);
    })
  })

})
let port = 3000;
server.listen(port, () => {
  console.log(`server port ${port} already`);
});


```

#### 封装成静态资源服务器:
```javascript
//封装成静态资源服务器
const http = require('http');
const url = require('url');
const path = require('path')
const fs = require('fs').promises;
const mime=require('mime')
const { createReadStream } = require('fs');

class StaticServer {
  async handlerRequest(req, res) {
    console.log(req.url);

    let { pathname } = url.parse(req.url);
    let filepath = path.join(__dirname, pathname);
    try {
      let stat = await fs.stat(filepath);
      if (stat.isFile()) {
        this.sendFile(filepath, res);
      } else {
        filepath = path.join(filepath, 'index.html');
        await fs.access(filepath);
        this.sendFile(filepath, res)
      }
    } catch (error) {
      return this.sendError(error, res);
    }
  }
  sendFile(filepath, res) {
    res.statusCode = 200;
    let type = mime.getType(filepath);
    res.setHeader('Content-Type', `${type};charset:utf-8`);
    createReadStream(filepath).pipe(res);
  }
  sendError(e, res) {
    res.statusCode = 404;
    let type = mime.getType('.txt');
    res.setHeader('Content-Type', `${type};charset:utf-8`);
    res.end('Not Found');
  }
  start(...args) {
    //监听服务器
    http.createServer(this.handlerRequest.bind(this)).listen(...args);
  }
}

new StaticServer().start(3000, () => {
  console.log(`port 3000 start`);
})

```
