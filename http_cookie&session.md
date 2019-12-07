### Cookie and Session
- Cookie 存放到客户端，服务器可以设置和读取数据 用于标识客户端身份（http无状态）
- cookie 不能存放敏感信息，客户端可见

- cookie的基本使用方法：
```javascript
const http=require('http')
http.createServer((req,res)=>{
    if(req.url=='/set'){
        //设置 cookie
        res.setHeader('Set-Cookie','name=zhangsan')
        return res.end('set ok')
    }
    if(req.url==='/get'){
      //读取cookie
        return res.end(req.headers.cookie||'empty')
    }
}).listen(3000)
```
- cookie 可以为子域设置
- cookie的参数
1. name：cookie的名字
2. value： cookie的值
3. domain: cookie的域
4. path： 哪个路径可以访问path （以path开头的都能访问 所以设置 /是表示全部都能访问）
5. expries(绝对时间)/max-age(单位秒) 过期时间
6. httpOnly 是否只能服务器去修改cookie的值

```javasciprt
//设置cookie的域
//注意：设置的是.baidu.com 就是表示支持全部的baidu.com的域
res.setHeader('Set-Cookie','name=zhangsan;domain=.baidu.com')

//设置过期时间：10秒过期
res.setHeader('Set-Cookie','name=zhangsan;domain=.baidu.com;max-age=10')

//设置多个cookie
res.setHeader('Set-Cookie',['name=zhangsan;domain=.baidu.com;max-age=10','name=age'])

//为了防止cookie被客户端篡改，可以在设置的cookie上添加一个签名：
res.setHeader('Set-Cookie','name=zhangsan.签名的字符串;domain=.baidu.com;max-age=10')

//在设置的时候添加签名，在获取值得时候需要解密
```

```javascript
//签名算法小例子：
const http=require('http')
const crypto=require('crypto')
function sign (value){
    return value=crypto.createHmac('sha1','thisiskey').update(value).digest('base64');
}
console.log(sign('zhangsan'))
```
#### session
- session是居于cookie的 不同的是 部分信息（重要信息）放到服务器端的
```javascript
let http = require('http');
let uuid = require('uuid');
let querystring = require('querystring')
let cardName = 'tian';
let session = {}; // 存到内存中 数据库，数据挂了 问题就是持久化丢了 
let server = http.createServer((req,res)=>{
    let arr = [];
    res.setCookie = function(key,value,options={}){
        let opts = [];
        if(options.domain){
            opts.push(`domain=${options.domain}`)
        }
        if(options.maxAge){
            opts.push(`max-age=${options.maxAge}`)
        }
        if(options.httpOnly){
            opts.push(`httpOnly=${options.httpOnly}`)
        }
        if(options.signed){ // 加盐算法 
            value =  value + '.' + sign(value)
        }
        arr.push(`${key}=${value}; ${opts.join('; ')}`);
        res.setHeader('Set-Cookie',arr);
    }
    req.getCookie = function(key,options = {}){
        let obj = querystring.parse(req.headers.cookie,'; '); // a=b; c=d; www=xxx  a=b&c=d
        if(options.signed){
            let [value,s] = obj[key].split('.');
            let newSign = sign(value);
            if(s === newSign){
                return value;
            }else{
                return undefined;
            }
        }
        
        return obj[key];
    }
    if(req.url === '/wash'){
        let id = req.getCookie(cardName)
        if(id && session[id]){ // 有卡
            session[id].mny -=100;
            res.end('current money is # '+session[id].mny)
        }else{
            let cardId = uuid.v4();
            session[cardId] = {mny:500};
            res.setCookie(cardName,cardId);
            res.end('current money is # 500 ')
        }
    }
    res.end('Not Found')
}).listen(3000);

```

#### localStroage sessionStorage cookie session 区别
1. localStroage 不能跨域 最多能存 5m 超过丢失 发请求的时候不会自动带上
2. sessionStorage 浏览器关闭丢失
3. cookie 在header上 每次请求自动带上 解决无状态的问题 最多4k 浪费流量
4. session 基于cookie 存到服务器上
