### http跨域

- 常见的跨域解决方案 `jsonp` `cors` `websocket`
- 跨域包含 `协议不同` `域名不同` `端口不同`

#### cors
- 使用cors处理跨域的问题,是在响应中设置`Access-Control-Allow-Origin` 例子:`res.setHeader('Access-Control-Allow-Origin','*')` req.headers.origin 表示谁访问我就允许谁跨域,作用和*相同
- 如果是复杂请求(一般请求添加了自定义的header就是复杂请求,复杂请求会先发一次options请求(options只是试探是否可以访问),) 如果设置了自定义的头需要在返回中设置 `Access-Control-Allow-Headers`来允许头的跨域 例子: `res.setHeader('Access-Control-Allow-Headers','token,my_uid')`
- 如果发送了一个非`get` `post`的请求也是一个复杂的请求,也需要设置服务器端允许的方法 `Access-Control-Allow-Methods` 例子: `res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,UPDATE')`
- 如果是跨域并且是复杂请求会先发一个`options`的请求去试探可不可以进行请求,这个`options`的时间也是可以设置的 单位是秒:`res.setHeader('Access-Control-Max-Age',1800)` 这样这个试探的`options`就会间隔1800秒再次询问
- 如果是跨域需要携带`cookie`,则需要在服务器端设置 允许携带凭证 `Access-Control-Allow-Credentials` 例子: `res.setHeader('Access-Control-Allow-Credentials',true)` 注:fetch请求需要添加特定的参数才能携带cookie