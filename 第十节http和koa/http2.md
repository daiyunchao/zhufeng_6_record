### http 压缩和缓存

使用http模块仿写一个http-server
代码已传到git:https://github.com/daiyunchao/dychttpserver中

流可分为 可读流 可写流 双共流(可读可写流) 转换流(压缩就是使用的转换流)

```javascript
//可写流,标准输出功能同 console.log('字符串')
//作用是将文本输出到控制台
process.stdout.write('字符串')

//可读流,接收用户输入的内容
process.stdin.on('data',()=>{

})

//转换流的小例子:

//可写流
// process.stdout.write('这是一段内容')

//可写流
// process.stdin.on('data', (data) => {

// })

//通过可读流和可写流实现回声效果:
//就像 createReadStream(filepath).pipe(res) 相同功能
//process.stdin.pipe(process.stdout)

//添加需求,如何才能将我的回声效果中输入的小写字母转换成大写字母呢
//就需要我们的转换流
//调用就变成了
//process.stdin.pipe(charTransform).pipe(process.stdout) 如何实现呢

let { Transform } = require('stream');

class CharTransform extends Transform {
  _transform(chunk, encoding, callback) {
    chunk = chunk.toString().toUpperCase();
    // console.log("chunk==>",chunk);
    this.push(chunk)
    callback();
  }
}

let charTransform = new CharTransform();
process.stdin.pipe(charTransform).pipe(process.stdout)

```

#### node中使用 zlib进行压缩
```javascript
let zlib=require('zlib');

//普通文本压缩:
let zlib=require('zlib');
zlib.gzip(fs.readFileSync('./abc.txt'),(err,data)=>{
  fs.writeSync('./abc.gz',data)
})

//用流的方式压缩:
//在这里 zlib.createGzip()就是充当了一个转换流的作用
//类似的 将家里安装的净水器一样
let zlib=require('zlib');
fs.createReadStream('./abc.txt').pipe(zlib.createGzip()).pipe(fs.createWriteStream('./abc.gz'));
```

#### 复习http缓存头设置
- 缓存是服务器端设置的,客户端无法设置
- 使用`Cache-Control`的`max-age`叫做强制缓存
- 使用`Cache-Control`的`Last-Modified`叫做对比缓存或是协商缓存
- 使用`Etag`是指纹缓存(对文件进行签名生成一个摘要,是否获取新的数据时就采用etag的对比)
- 控制缓存有两个 一个是新版本的`Cache-Control` 另一个是旧版本的`Expires` 一般使用第一个就可以了
- 当设置 `Cache-Control:max-age:10`为: `max-age`就表示客户端请求了一次后再过10秒后才会再次请求
- 当设置`Cache-Control:no-cache` 表示客户端不使用缓存,但缓存还是会进行存储
- 当设置`Cache-Control:no-store`表示客户端不存储缓存

```javascript
//协商缓存
//设置一个文件的修改时间
res.setHeader('Last-Modified',stat.ctime.toGMTString())

//从客户端获取文件上次修改文件的时间
let ifModifiedSince=req.headers['if-modified-since']

//如果是相同的,则说明文件没有修改
if(ifModifiedSince===stat.ctime.toGMTString()){
    res.statusCode=304;
}else{
  //如果是不相同的,则说明文件修改过了
  res.statusCode=200;
}

```

```javascript
//指纹缓存
//在返回结果中添加上 Etag值
//问题:
//如果文件比较大,读取文件时就会有性能上的问题
//所以有的只是获取了文件的一部分
let newEtag=crypto.createHas('md5').update(fs.readFileSync('./abc.txt')).digest('base64')
res.setHeader('Etag',newEtag)

//判断请求中的etag值是否相同
let ifNoneMatch=req.headers['if-none-match'];
if(ifNoneMatch&&ifNoneMatch===newEtag){
  res.statusCode=304;
}else{
  res.statusCode=200;
}
```

#### 加密和签名
- 加密是可以解密的
- 签名是对一个文件或是一段话整体的描述 相同的文件签名的结果是相同的 签名的长度是相同的 而且签名的长度的相同的
- md5是签名不是加密
- sha1 sha256 叫加盐算法(就是能自己添加key值进行签名,这个key就是你加的盐,盐加的不同,菜的味道输出的东西自然就不同)

```javascript
//核心模块,用于加密或是签名
const crypto=require('crypto')

//使用md5去签名123456 最后输出是base64
crypto.createHash('md5').update('123456').digest('base64')

//使用sha1签名123456 最后输出base64
crypto.createHmac('sha1','key').update('123456').digest('base64')

```