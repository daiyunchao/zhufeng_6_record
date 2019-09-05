//什么是高阶函数?
// 参数是函数 或是返回值是函数的 函数就是高级函数

//最常见的例子: before函数

let say = () => {
  console.log("说");
}

//如果我想在单纯的say方法前在执行一个函数
//达到效果 let newAsy= asy.before(()=>{xxx})
//这不就是 设计模式中的"包装"吗?? asy很单纯 我在单纯的say中包装一个另外的东西,让原本单纯的say具备不同的功能

Function.prototype.before = function (fn) {
  return (...args) => {
    fn();
    this(...args);//this也是一个函数
  }
}

let newSay = say.before(() => { console.log("您好") });
newSay();

let newSay2 = say.before(() => { console.log("您好") }).before(() => { console.log("您好01") })
newSay2();
//say方法其实就是最核心的逻辑代码,我们保证他的独立和单纯,
//其他的事情让其他方法来实现,最后用高阶函数将两个函数组合起来

//颗粒化的好处是什么呢? 核心思想 将函数的参数进行保留,等待参数的个数同函数需要的个数时候在使用(fn.length可得到函数的参数个数)
//就像bind函数
//warpper
//

//订阅发布模式 说白了订阅发布就是 将函数和函数触发建立关系 




//最简单的订阅发布模式

//
//这是订阅
//当有新快递到来后,送到我的办公室
e.on(() => {
  console.log("把它送到我办公室");
});

//
//这是发布
//新的东西来了,
e.emit();

let e = {
  list: [],
  on(fn) {
    this.list.push(fn);
  },
  emit() {
    this.list.forEach(fn => {
      fn();
    })
  }
}


//无论是什么新的东西来了 都可以通过emit的方式触发
let printer = {
  createNewsPaper() {
    console.log("有新的报纸了");
    e.emit();
  },
  createNewProduction() {
    console.log("有新的产品了");
    e.emit();
  }
}