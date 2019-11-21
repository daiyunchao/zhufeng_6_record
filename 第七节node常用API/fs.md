### fs
> 用于读写文件 可用同步或是异步的方式读取文件
> 同步堵塞进程 异步不堵塞进程 取舍:当进程启动的时候可以使用同步的方法,在程序执行过程中使用异步会更好
> 更好的选择`awaitfs`使用第三方库 或是自己将`fs`的函数进程Promise的封装

读写小例子:
```javascript

const fs=require('fs');
fs.readFile('./node.txt',(err,data)=>{
  fs.writeFile('./node1.txt',data,(err)=>{
    console.log("读写成功");
    
  })
})

```

**一般的读写需要注意的点:因为文件的读取再写入是一定要经过内存的,如果我们使用`readFile`去读取大文件可能会出现内存过大的问题**
针对这个问题的解决方法: 分段读取/写入 在`Node`中可使用流的方式进行操作

```javascript
//如果不使用流的方式如何分段读取文件呢?

//只读取了文件的前3个buffer
const fs = require('fs');
fs.open('./node.txt', 'r', (err, rfd) => {
  //一次写入3个到buffer中
  let buffer = Buffer.alloc(3);
  fs.read(rfd, buffer, 0, 3, 0, (err, byteRead) => {
    fs.close(rfd,()=>{});
    fs.open('./node2.txt', 'w', (err, wfd) => {
      fs.write(wfd, buffer, err => {
        fs.close(wfd,()=>{});
      })
    })
  });
})


//修改的promise版本:
const fs = require('fs');
const util = require('util');

let open = util.promisify(fs.open);
let read = util.promisify(fs.read);
let write = util.promisify(fs.write);
let close = util.promisify(fs.close);

let rfd = null;
let wfd = null;
let buffer = Buffer.alloc(3);
open('./node.txt', 'r').then(fd => {
  rfd = fd;
  return read(rfd, buffer, 0, 3, 0)
}).then(byteRead => {
  close(rfd);
  return open('./node2.txt', 'w')
}).then(fd => {
  wfd = fd;
  return write(wfd, buffer, 0, 3, 0)
}).then(() => {
  close(wfd);
});


//循环读取的版本:

const fs = require('fs');
const util = require('util');

let open = util.promisify(fs.open);
let read = util.promisify(fs.read);
let write = util.promisify(fs.write);
let close = util.promisify(fs.close);


function littleReadFile(bufferLength, startPostion, end = 0) {
  let rfd = null;
  let wfd = null;
  let buffer = Buffer.alloc(bufferLength);
  return open('./node.txt', 'r').then(fd => {
    rfd = fd;//030
    return read(rfd, buffer, 0, bufferLength, startPostion)
  }).then(data => {


    close(rfd);
    if (data.bytesRead == 0) {
      throw new Error('fileReadEnd');
    }
    return open('./node2.txt', 'w')
  }).then(fd => {
    wfd = fd;
    console.log(buffer, bufferLength, startPostion);
    return write(wfd, buffer, 0, bufferLength, end)
  }).then(() => {
    close(wfd);
  });
}


// littleReadFile(3, 3)

(async () => {
  let needLoop = true;
  let start = 0;
  let total = 0;
  while (needLoop) {
    try {
      console.log("读取中...");
      await littleReadFile(3, start, total);
      start += 3;
      total += 3;
    } catch (error) {
      needLoop = false;
    }
  }
  console.log("文件读写完成");
})()



```


#### fs常用方法

文件
> `fs.readFile readFileSync` 读取文件内容
> `fs.writeFile writeFileSync` 向文件中写入内容
> `fs.rename(oldfilepath,newfilepath,callback)` 重名文件
> `fs.unlink(filepath,callback)` 删除文件
> `fs.existsSync fs.access` 文件是否存在
> `fs.copy`拷贝文件

文件夹
> `fs.mkdir `创建目录
> `fs.rmdir` 删除目录
> `fs.readdir` 读取目录 返回数组
> `fs.stat` 判断当前路径状态 其中有一个方法 `.isFile()`用于判断是否为文件/文件夹
> `const fs=require('fs').promises` 如果想使用`fs`的`promise`版本,可以这样引用`fs`方便的写法并且比同步函数更节约资源

#### 创建多级目录的方法:
```javascript
//创建多级目录:
function mkdir(dirpath) {
  let absolutePath = path.join(__dirname, dirpath);
  console.log(absolutePath);

  //将路径拆分
  //分段判断是否文件夹存在
  //如果不存在,创建文件夹
  let dirpaths = dirpath.split('/');
  let index = 1;
  function next() {
    if (index === dirpaths.length+1) {
      return;
    }
    let currentDirpath = dirpaths.slice(0, index++).join('/');
    console.log(currentDirpath);
    
    let isExists = fs.existsSync(currentDirpath);
    if (isExists) {
      //文件是存在的,创建下一级
      next();
    } else {
      //文件不存在,创建文件夹
      fs.mkdirSync(currentDirpath);
      next();
    }
  }

  next();

}

mkdir('./a/b/c/d/e/f');
console.log("创建完成....");
```

#### 删除多级文件夹
```javascript
function rmdir(dirpath) {
  //读取目的,判断目录中是否有文件或是文件夹
  //如果有文件删除文件
  //如果有文件夹再判断它其中是否有文件或文件夹
  let absolutePath = path.join(__dirname, dirpath);
  let currentPath = absolutePath;
  function next(rmpath) {
    let dirs = fs.readdirSync(rmpath);
    if (dirs.length == 0) {
      //如果是没有长度,则说明没有文件或是文件夹
      return fs.rmdirSync(rmpath);
    }
    dirs.forEach(item => {
      let newPath = path.join(rmpath, item);
      let stat = fs.statSync(newPath);
      if (stat.isFile()) {
        //如果是文件
        fs.unlinkSync(newPath)
      } else {
        //如果是文件夹
        next(newPath);
      }
    });

    //执行完了内部文件的删除再删除本文件夹
    fs.rmdirSync(rmpath);
  }
  next(currentPath);

}
rmdir('./a');
```


#### 删除多级文件夹 并发优化版 深度删除
```javascript
async function rmdirNew(dirpath) {
  let s=await stat(dirpath);
  if (s.isFile()) {
    //如果是文件
    await unlink(dirpath);
  } else {
    //如果是文件夹
    let dirs = await readdir(dirpath);
    dirs = dirs.map(item => rmdirNew(path.join(dirpath, item)));
    await Promise.all(dirs);
    await rmdir(dirpath);
  }
}
rmdirNew(path.join(__dirname, './a'));
```

#### 删除多级文件夹 广度删除
```javascript
//广度删除文件夹

//有文件夹 如下
/*
-a
--b
---d
--c
---e
---f
*/
//实现横向删除
//解决办法: 将文件夹读取成:abcdef 然后在依次删除

function rmDirNew(dirpath) {
  let paths = getPaths(dirpath);
  console.log("paths==>", paths);
  paths.reverse().forEach(item => {
    let s = fs.statSync(item);
    if (s.isFile()) {
      fs.unlink(item)
    } else {
      fs.rmdirSync(item);
    }
  });

}

function getPaths(dirpath, dirs = []) {
  dirs.push(dirpath);
  let cstat = fs.statSync(dirpath);
  if (cstat.isFile()) {
    return;
  }
  let cdirs = fs.readdirSync(dirpath);
  cdirs.map(item => getPaths(path.join(dirpath, item), dirs));
  return dirs;
}

rmDirNew(path.join(__dirname, './a'));
console.log("删除完成");

```

#### 文件流
##### 小例子和参数解析
```javascript
//可读流小例子:
//文件流

//创建一个可读文件流
//创建一个文件流不等于真正的去读取文件,而是持有读取文件的配置,就像我的水管已经修好,就等我拧开水龙头一样
let rs = fs.createReadStream('./node.txt', {
  //权限有 rwx三种 r:读取 w:写入 x:执行
  flags: 'r',//当前要做什么操作 有很多类型: r:读取文件,如果文件不存在则会报错, 
  //a:打开文件用于追加,如果文件不存在,则创建
  //w: 打开文件用于写入。如果文件不存在则创建文件，如果文件已存在则截断文件
  encoding: null,//读取时使用什么编码,默认值为 Buffer
  mode: 0o666,//模式,权限 读取的权限是4 写入的权限是2 执行的权限是1 
  //如果666:则表示 我的权限,我的用户组权限 别人的权限 都是可读可写的但不能执行
  //如果是777: 则表示 我&用户组&别人 都有最高权限 读写执行
  autoClose: false,//是否自动关闭
  //start:0,//读取的开始位置
  //end:10,//读取的结束位置
  highWaterMark: 64 * 1024,//每次读取暂用内存的大小单位是字节,默认大小是64kb
})


//当文件被打开的时候回被调用
rs.on('open', () => {
  console.log("文件已打开");
})

//当有新内容被读取的时候回被调用
//因为每次读取时有限制的 受到参数:highWaterMark的影响,默认是64kb
//所有,我们需要将读取到的内容进行保存

//当然如果是大文件,使用以下的方式完全是不妥的,因为用一个变量去保存内容还是保存到内存中
//就失去了文件流的意义
//这里只是做一个api的演示:

//申明一个数组用于存放,一直源源不断读取到的新内容
//为甚用数组?因为读取的是buffer
let arr = [];
rs.on('data', (data) => {
  console.log("有内容被读取了");
  arr.push(data)
})


//文件读取完毕后被调用
rs.on('end', () => {
  console.log("文件已读取完毕");
  //将读取完的buffer转换成字符串
  let res=Buffer.concat(arr).toString();
  console.log(res);
  
})

//有异常时会被触发
rs.on('error', () => {
  console.log("读取文件失败");
})

```

#### 可读流的原理:
 主要是用到了 `open` `close` `read` 这些`fs`的方法 再加上 `event`去做事件
``` javascript
//可读流原理分析
let fs = require('fs');
const EventEmitter = require('events')
class ReadStream extends EventEmitter {
    constructor(filepath, options) {
        super();
        //将用户传入的参数进行保存
        this.filepath = filepath;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding || null;
        this.mode = options.mode || 0o666;
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.start = options.start || 0;
        this.end = options.end;
        this.fd = null;
        this.isflowing = false;
        this.offset = 0;
        this.size=0;


        //创建这个对象时，就将这个文件打开
        this.open();


        //当用户监听data事件，才真正的读取文件
        this.on('newListener', (type) => {
            if (type === 'data') {
                //如果用户监听的是data，则开始读取文件
                this.read();
            }
        })
    }


    read() {
        //问题：可能调用该方法时，还没有得到fd
        console.log("type this fd==>", typeof this.fd)
        if (typeof this.fd !== 'number') {
            //如果没有收到，则去监听open事件，当收到open事件的通知，则肯定就拿到了fd
            return this.once('open', (fd) => {
                //this.fd=fd;//可使用该参数，也可直接使用this.fd
                 this.read();
            })
        }
        let howMuchToRead = this.end?Math.min(this.highWaterMark,this.end-this.start + 1 - this.offset):this.highWaterMark;
        let buffer = Buffer.alloc(howMuchToRead);
        fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, readByteLength) => {
            if (readByteLength > 0) {
                this.emit('data', buffer.slice(0,readByteLength));
                this.offset += readByteLength;
                this.read();
            } else {
                this.emit('end')
                if (this.autoClose) {
                    this.close();
                }
            }
        })
    }
    
    close() {
        fs.close(this.fd, () => {
            this.emit('close');
        })
    }
    open() {
        let stat=fs.statSync(this.filepath);
        console.log("stat==>",stat);
        
        fs.open(this.filepath, (err, fd) => {
            this.fd = fd;
            //当文件被打开，就发送一个通知，告诉调用者
            this.emit('open', this.fd);
        })
    }
}


module.exports = ReadStream;
```