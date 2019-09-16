//没有compose函数的用法
function sub(a, b) {
  return a + b;
}

function len(str) {
  return str.length;
}

function addRMB(len) {
  return '$' + len;
}

//想组合调用三个函数
let ret = addRMB(len(sub('abc', 'bcd')));
console.log(ret);


//想要实现:
let ret_compose = compose(addRMB, len, sub)('abc', 'bcd');

function compose(...fns) {
  //找到第一个需要执行的函数
  let lastfn = fns.pop();
  return function (...args) {
   return fns.reduceRight((pre, current) => {
      return current(pre);
    }, lastfn(...args))
  }
}
console.log(ret_compose);
