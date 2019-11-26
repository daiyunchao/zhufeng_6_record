const http = require('http')

// get请求
// http.get('http://localhost:3000', function () {
//   console.log("args==>", arguments);
// });

//post请求

//配置请求行和请求头
let postConfig = {
  host: "localhost",
  port: "3000",
  headers: {
    "Content-Type":"application/x-www-form-urlcoded",
    name: "zhangsan"
  },
  method: "POST"
}
let client = http.request(postConfig, function (res) {
  let arr = [];
  //接收响应体的内容
  res.on('data', function (chunk) {
    arr.push(chunk)
  })
  res.on('end', function () {
    console.log(Buffer.concat(arr).toString());
  })
});

//请求体
client.write('age=18');
client.end();



