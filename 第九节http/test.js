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