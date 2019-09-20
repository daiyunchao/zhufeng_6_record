### Nodejs模块
>  常见模块 ES6规范 CommonJS规范 共同点:每一个文件都是一个模块

#### CommonJS规范
> require 引入文件 module.exports 导出文件




#### require module.exports 使用到的node模块
```javascript
  const fs=require('fs')
  fs.readFile //读取文件
  fs.readFileSync //同步读取文件
  fs.accessSync('./a.txt') //判断文件是否存在

  const path=require('path')
  path.resolve//分析路径
  path.join//组装路径
  __dirname 当前文件绝对路径
  path.extname 获取文件的扩展名
  path.basename 获取文件除了扩展名的部分
  path.dirname 当前文件所属的文件夹名称

  const vm=require('vm')
  vm.runInThisContext()//在当前的上下文中执行代码
  vm.runInThisContext('console.log("zhangsan")');
  //好处是 它是一个沙盒不会被外部的变量所污染

```


#### require和module.exports的原理
```javascript
  const fs = require('fs')
  const path = require('path')
  const vm = require('vm')

  let req = filename => {
    try {
      fs.accessSync(path.join(__dirname, filename));
      //文件存在
      //读取文件
      let fileContent = fs.readFileSync(path.join(__dirname, filename), 'utf8');
      return vm.runInThisContext(fileContent)
    } catch (error) {
      //文件不存在
      throw new Error('文件不存在')
    }
  }

  let a = req('./a.js');
  console.log(a);

```

```javascript
  //更贴近源码的版本
  const fs = require('fs')
  const path = require('path')
  const vm = require('vm')

  class Module {
    constructor(filepath) {
      this.id = filepath;
      this.exports = {};//用于存放模块的返回值
    }
  load() {
    //加载文件

      let fileContent = fs.readFileSync(this.id, 'utf8');
      //将内容进行封装,使用函数作用域防止变量污染全局作用域

      //1.使用new Function的方式创建一个作用域(缺点,该方法的变量可能会被全局作用域污染)
      // let fn = new Function('exports', 'module', 'require', fileContent);

      // //执行该函数:
      // //执行该函数其实就是一个赋值,将值赋予this的module.exports中
      // fn(this.exports, this, req);

      //2.使用字符串拼接,使用vm的方法去执行避免刚才的问题
      let str = `(function(exports,module,require){${fileContent}})`;
      let fn = vm.runInThisContext(str);
      fn(this.exports, this,req)
    }
  }

    function req(filename) {
      //读取这个文件
      let filepath = path.join(__dirname, filename);
      let module = new Module(filepath);
      module.load();
      return module.exports;
    }

    let a = req('./a.js');
    console.log(a);//hello
```