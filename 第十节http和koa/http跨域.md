### http跨域

- 常见的跨域解决方案 `jsonp` `cors` `websocket`
- 跨域包含 `协议不同` `域名不同` `端口不同`

#### cors
- 使用cors处理跨域的问题,是在响应中设置`Access-Control-Allow-Origin` 例子:`res.setHeader('Access-Control-Allow-Origin','*')` req.headers.origin 表示谁访问我就允许谁跨域,作用和*相同
- 如果是复杂请求(一般请求添加了自定义的header就是复杂请求,复杂请求会先发一次options请求(options只是试探是否可以访问),) 如果设置了自定义的头需要在返回中设置 `Access-Control-Allow-Headers`来允许头的跨域 例子: `res.setHeader('Access-Control-Allow-Headers','token,my_uid')`
- 如果发送了一个非`get` `post`的请求也是一个复杂的请求,也需要设置服务器端允许的方法 `Access-Control-Allow-Methods` 例子: `res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,UPDATE')`
- 如果是跨域并且是复杂请求会先发一个`options`的请求去试探可不可以进行请求,这个`options`的时间也是可以设置的 单位是秒:`res.setHeader('Access-Control-Max-Age',1800)` 这样这个试探的`options`就会间隔1800秒再次询问
- 如果是跨域需要携带`cookie`,则需要在服务器端设置 允许携带凭证 `Access-Control-Allow-Credentials` 例子: `res.setHeader('Access-Control-Allow-Credentials',true)` 注:fetch请求需要添加特定的参数才能携带cookie

- 写起来很麻烦，当然也可以使用 第三方库`cors`来使用很简单

#### 反向代理&正向代理
- 什么是正向代理： 代理服务器和客户端是一头的，对服务器而已代理是透明的，比如翻墙使用的代理，就是正向代理 这个时候代理服务器的作用多数是认证、权限验证
- 什么是反向代理： 代理服务器和服务器是一头的，对客户端而已代理是透明的，比如nginx webpack proxy 这个时候代理服务器的作用多数是 缓存
- webpack proxy的原理 其实就是一个中转服务器，可使用`http-proxy`第三方库实现
```javascript
//使用http-proxy的小例子
//也是反向代理的一个小例子
const http=require('http')
const httpProxy=require('http-proxy');
let hp=httpProxy.createProxyServer();
http.createServer((req,res)=>{
  //将全部的请求都代理到目标baidu服务器上去进行处理
  hp.web(req,res,{target:'http://www.baidu.com'})
}).listen(3000)
```

```javascript
//使用httpProxy实现最基本的反向代理功能
//需求：假如一台服务器是www.abc.com 和 www.bcd.com两个域名的主机，现在要通过反向代理的方式将两个域名的请求区分开
const http=require('http')
const httpProxy=require('http-proxy')
let serverProxys={
  "www.abc.com":"http://localhost:3000",
  "www.bcd.com":"http://localhost:3001"
}
let hp=httpProxy.createProxyServer();
http.createServer((req,res)=>{
  hp.web(req,res,{target:serverProxys[req.headers.host]})
}).listen(80)

```


#### agent 通过user-agent进行转向
- 主要是针对目前 pc和手机端不是相同的进程
- 客户端通过判断agent也能实现这个效果，不过看到的response不是302
```javascript
//例子：如果是手机页面跳转到百度 如果不是手机则跳转到bing
const http=require('http')
http.createServer((req,res)=>{
  let agent=req.headers["user-agent"];
  if(agent.includes("iPhone")){
    res.statusCode=302;
    res.setHeader('Location',"http://www.baidu.com");
    res.end()
  }else{
    res.statusCode=302;
    res.setHeader('Location',"http://www.bing.com");
    res.end()
  }
})
```
