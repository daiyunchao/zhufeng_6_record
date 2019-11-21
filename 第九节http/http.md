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