### Buffer
经典面试题: 为什么`0.1+0.2!=0.3`
定义变量时会将值存放当内存中 (内存中都是二进制的)
`0.1`的内存中的值是:`0.0001100110011001100110011001100110011001100110011001101`
`0.2`的内存中的值是:`0.001100110011001100110011001100110011001100110011001101`
所以`0.1+0.2>0.3`


十进制转换二进制的方法 小数(*2 取整)
```javascript
//0.1的十进制如何转换成二进制的
0.1*2=0.2=>0
0.2*2=0.4=>0
0.4*2=0.8=>0
0.8*2=1.6=>1
//1.6取了整数后剩下0.6
0.6*2=1.2=>1
0.2*2=0.4=>0
0.4*2=0.8=>0
0.8*2=1.6=>1
0.6*2=1.2=>1
//...
```
方式1:整数的二进制如何转换成十进制(进制的值+进制*进制的N次方)(从右开始)
方式2:进制的N次方-1
```javascript
//二进制的1111转换成十进制
//1*2的0次方+1*2的1次方+1*2的2次方+1*2的3次方
1+2+4+8=15


//方式2
2**4-1=15
```


#### 编码
1. ASCII 最早的编码格式,1个字节代表一个符号,1个字节=8个位(bit),最大长度是255(2**8-1)已经能满足最基本的需要了 \r=13 \n=10
2. 但随着发展有的字符不能再一个字节中表示完了,就出现了新的编码方式 `gb2312 gb18030 gbk`等 但还是不能满足全部的字符
3. 出现了新的可变长的编码`utf8` 可变长 如果字符<255 就用一个字节表示 如果是大于255 就用两个字节表示 以此类推

#### 在JS中转换的方法
1. 10进制转换成其他进制 `100..toString(2)`
2. 其他进制的转换成10进制 `parseInt('ff',16)`
3. 在chrome控制中直接输入 `0xff`就能出来10进制对应的值(8进制是 0o 2进制0b)


#### Base64

`base64`不是加密解密的方式,只是一种编码,缺点是会比原始文件(2进制资源)大1/3
为什么会大呢?
来个例子:
将"张"转换成base64的过程
1. 将张转换成2进制  <Buffer e5 bc a0> (使用方法`Buffer.form('张')`)
2. 将Buffer的16进制表示成2进制  `11100101 10111100 10100000` (使用方法  0xe5.toString(2))
3. 将8位的二进制转换成6位 `111001 011011 110010 100000`
4. 原来2进制8位可以表示一个字节 改成了6位表示一个字节 所以比原来的字符大了1/3

todo: 自己实现一个base64的转化功能
```javascript

```

#### Node中如何使用Buffer
`buffer就是内存的代表 特点是不能扩容`
声明方式:
`let buf =Buffer.alloc(5)`申请5个字符的容量
`let buf=Buffer.allocUnsafe(5)`申请5个不安全的字符容量,不安全的含义是,获取刚被释放的内存,速度较快
`Buffer.callocUnsafe+Buffer.fill=Buffer.alloc`
`Buffer.fill`手动填充Buffer中的内容

使用字符串声明:
`Buffer.from('这是中文')`

使用数组
`Buffer.from([1,2,3,4])`

判断是否是buffer:
`Buffer.isBuffer(Buffer.from('张三'))`

copy Buffer
因为分配内存都是连续的,并且分配好的内存是不能扩展的,所以想增大原来的一个内存不能再原来的基础上扩展,只能使用一块新的更大的内存来保存
```javascript
let buff1=Buffer.from('张');
let buff2=Buffer.from('三');

//现在的目标是 想要将 张三放到一块去

//一个中文三个字节
//两个字分配6个字节
let buff=Buffer.alloc(6);

//新的buffer.copy(目标buffer,新的buffer的开始位置,目标buffer的开始位置,目标buffer的结束位置)
buff1.copy(buff,0,0,3);
buff2.copy(buff,3,0,3);
console.log(buff.toString());
```
```javascript
//自己实现 Buffer的copy函数:
Buffer.prototype.copy = function (targetBuffer, start, oldBufferStart, oldBufferEnd) {
  let postion = start;
  for (;oldBufferStart < oldBufferEnd; oldBufferStart++ , postion++) {
    const buffer = this[oldBufferStart];
    targetBuffer[postion] = buffer;
  }
}

let buff1 = Buffer.from('张');
let buff2 = Buffer.from('三');

let buff = Buffer.alloc(6);
buff1.copy(buff, 0, 0, 3)
buff2.copy(buff, 3, 0, 3)
console.log(buff.toString());

```

buffer的拼接 `Buffer.concat(数组,拼接的buffer,生成新的buffer的长度)`
```javascript

let buff1 = Buffer.from('张');
let buff2 = Buffer.from('三');
let newBuffer=Buffer.concat([buff1,buff2]);
console.log(newBuffer.toString());

```
#### 扩展Buffer的split方法
```javascript
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

```

#### 自己实现Base64加密解密

```javascript

//有Bug...
const Base64CodeLib = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split('');

//加密的方法:
function base64EnCode(str) {
  let buff = Buffer.from(str);
  let bStr = "";
  console.log(buff);

  buff.forEach(item => {
    let newB = (item).toString(2);
    while (newB.length < 8) {
      newB = "0" + newB;
    }
    bStr += newB;
  })

  let baseStr = "";
  let baseStrArr = [];
  let hasMoreLen = true;
  let index = 0;
  while (hasMoreLen) {
    let startNumber = index * 6;
    let str = bStr.substr(startNumber, 6);
    str.length > 0 && baseStrArr.push(str);
    index += 1;
    if (index * 6 > bStr.length) {
      hasMoreLen = false;
    }
  }
  console.log(baseStrArr);


  baseStrArr.forEach(item => {
    baseStr += Base64CodeLib[parseInt("00"+item, 2)];
  })
  return baseStr;
}

console.log(base64EnCode('dankogai'));

//使用Node自带的方法验证
console.log(Buffer.from('dankogai').toString('base64'));


```

#### drag拖拽预览图片功能
```javascript
document.getElementById('drag').ondragover = function (e) {
      e.preventDefault();
    }
    document.getElementById('drag').ondrop = function (e) {
      e.preventDefault();
      let fr = new FileReader();
      fr.readAsDataURL(e.dataTransfer.files[0])
      fr.onload = function (e) {
        let base64 = e.target.result;
        let img = new Image();
        img.style="width:200px";
        img.src = base64;
        document.getElementById('drag').appendChild(img);
      }
    }
```