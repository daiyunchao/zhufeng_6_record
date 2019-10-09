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
console.log(Buffer.from('asdasds').toString('base64'));

