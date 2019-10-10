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

