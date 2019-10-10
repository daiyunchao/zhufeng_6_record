let buffer = Buffer.from(`张三李四王五
张三李四王五
张三李四王五
张三李四王五
`)

Buffer.prototype.split = function (splitTag) {
  //找到分隔符的长度:
  let len = Buffer.from(splitTag).length;

  //用于标记开始位置:
  let offset = 0;

  //用于判断是否执行循环
  let doWhile = true;

  let res = [];

  while (doWhile) {
    //结束位置:
    let endPoint = this.indexOf(splitTag, offset);
    if (endPoint < 0) {
      doWhile = false;
    } else {
      res.push(this.slice(offset, endPoint));
      //新的偏移量:
      offset = endPoint + len;
    }
  }
  res.push(this.slice(offset));
  return res;

}
let arr = buffer.split('\n');
console.log(arr.length);

for (let index = 0; index < arr.length; index++) {
  const element = arr[index];
  console.log(element.toString());
}

