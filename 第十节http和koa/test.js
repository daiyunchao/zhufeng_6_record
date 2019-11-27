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