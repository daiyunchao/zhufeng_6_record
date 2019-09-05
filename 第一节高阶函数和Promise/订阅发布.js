//观察者模式和订阅发布模式的不同点在于,订阅发布模式 订阅者和发布者是解耦的,他们的关联是通过第三方来的
//例子:
let e = {
  arr: [],
  on(fn) {
    this.arr.push(fn)
  },
  emit() {
    this.arr.forEach(fn => {
      fn();
    })
  }
}

e.on(() => { console.log("哎呦喂,有新的消息来了哇"); });
e.on(() => { console.log("来来来,放我办公室"); });
let printer = {
  newNewsPaper() {
    console.log("有新的报纸了");
    e.emit();
  },
  newProducetions() {
    console.log("有新产品了");
    e.emit();
  }
}

printer.newNewsPaper();
printer.newProducetions();



