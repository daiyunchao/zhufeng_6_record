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


