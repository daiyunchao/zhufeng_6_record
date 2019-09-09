//监控对象,set方法只能监控一级
let _zhangsan = {
  name: 'zhangsan',
  age: 18,
  son: {
    name: 'lisi',
    age: 1
  }
}

let observer = (obj) => {
  let cache = new WeakMap;
  let handler = {
    get(target, key) {
      console.log("进入get");
      if (typeof target[key] === 'object' && target[key] != null) {
        if (cache.has(target[key])) {
          return cache.get(target[key]);
        }
        let newProxy = new Proxy(target[key], handler);
        cache.set(target[key], newProxy);
        return newProxy;
      }
      return target[key];
    },
    set(target, key, value) {
      console.log("进入set");
      target[key] = value;
    }
  }
  return new Proxy(obj, handler)
}

let zhangsan=observer(_zhangsan);
zhangsan.son.name='lisi';



