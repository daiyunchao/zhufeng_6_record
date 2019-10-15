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