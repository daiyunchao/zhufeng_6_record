//Promise的三种不同的状态:
const PENDDING = 'PENDDING';
const SUCCESSED = 'SUCCESSED';
const FAILD = 'FAILD';

//处理then后的结果

const resolvePromise = (newPromise, x, resolve, reject) => {
  //用于处理then调用的返回结果
  if (newPromise === x) {
    throw new TypeError("不能自己调用自己");
  }
  
  //判断是否是Promise对象
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
	  
	//定义一个变量,用于防止状态的重复修改
    let called = false;
    try {
      //有then方法,说明是promise对象
      //如果是promise对象,则需要获取它的返回值
      then = x.then;
      if (typeof then === 'function') {
        then.call(x,
          data => {
            //如果data也是一个promise呢?
            if (called) return;
            called = true;
			//如果是promise对象,则递归自己,不然下一个then收到的就是一个Promise对象而不是Promise的处理结果
            resolvePromise(newPromise, data, resolve, reject);
          },
          err => {
            if (called) return;
            reject(err);
          })
      } else {
        if (called) return;
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      reject(error);
    }
  } else {
    //就是普通的值
    resolve(x);
  }

}
class Promise {
  constructor(execture) {
	//用于存储:直接的结果
    this.data = undefined;
	//用于存储错误原因
    this.reasion = undefined;
	//默认状态
    this.status = PENDDING;
	//用于存储成功的回调函数,只有当promise中执行是异步代码时,才有值
    this.successCallbacks = [];
	//同上
    this.faildCallbacks = [];
	
	//成功状态的处理
    let resolve = data => {
      if (this.status !== PENDDING) {
        return;
      }
	  //用于处理: new Promise((resolve,reject)=>{resolve(new Promise(r,j){r('123')})})这种resolve嵌套Promise的情况
      if (data instanceof Promise) {
        return data.then(resolve, reject);
      }
	  //将返回值存储
      this.data = data;
	  //修改状态为"成功"状态
      this.status = SUCCESSED;

	  //用于处理:异步
      this.successCallbacks.forEach(fn => {
        fn(this.data);
      })
    };
	
	//整体思路和reslove相同
    let reject = reasion => {
      if (this.status !== PENDDING) {
        return;
      }
      this.status = FAILD;
      this.reasion = reasion;

      this.faildCallbacks.forEach(fn => {
        fn(this.reasion);
      })
    }

    try {
      execture(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(successCallback, faildCallback) {
	//给参数赋予默认值
    successCallback = typeof successCallback === 'function' ? successCallback : val => val;
    faildCallback = typeof faildCallback === 'function' ? faildCallback : err => { throw err };
    let newPromise = new Promise((resolve, reject) => {
      if (this.status === PENDDING) {
        //如果是pendding状态,则说明promise是一个异步函数
		//如果是异步函数,则将处理函数添加到"successCallbacks"和"faildCallbacks"中去
        this.successCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.data);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.faildCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = faildCallback(this.reasion);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        })
      } else if (this.status === SUCCESSED) {
        //如果是成功状态,则直接处理结果
        setTimeout(() => {
          try {
            let x = successCallback(this.data);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === FAILD) {
        setTimeout(() => {
          try {
            let x = faildCallback(this.reasion);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    })
    return newPromise;
  }

  //finally函数,始终都需要执行的函数
  finally(finallyCallback) {
    return this.then(finallyCallback, () => {
	  //如果前一个then throw了一个异常,则会进入该方法,finally的做法是执行完自己的逻辑后再throw一个相同的错误出去
      finallyCallback();
      throw this.reasion;
    });
  }

  catch(faildCallback) {
    return this.then(null, faildCallback);
  }

  static race(tasks) {
    return new Promise((resolve, reject) => {
      let proccessData = (index, data) => {
        resolve(data);
      }
      for (let index = 0; index < tasks.length; index++) {
        const currentTask = tasks[index];
        if ((typeof currentTask === 'object' && currentTask !== null) || typeof currentTask === 'function') {
          if (typeof currentTask.then === 'function') {
            //如果是有then方法的object或是function,我们就认为它是promise对象
            currentTask.then(data => {
              proccessData(index, data);
            }, reject)
          } else {
            //不是promise对象
            proccessData(index, currentTask);
          }
        } else {
          //不是promise对象
          proccessData(index, currentTask);
        }
      }
    })
  }
  static all(tasks) {
    return new Promise((resolve, reject) => {
      let arr = [];
      let i = 0;
      let proccessData = (index, data) => {
        arr[index] = data;
        i = i + 1;
        if (i == tasks.length) {
          resolve(arr);
        }
      }
      for (let index = 0; index < tasks.length; index++) {
        const currentTask = tasks[index];
        if ((typeof currentTask === 'object' && currentTask !== null) || typeof currentTask === 'function') {
          if (typeof currentTask.then === 'function') {
            //如果是有then方法的object或是function,我们就认为它是promise对象
            currentTask.then(data => {
              proccessData(index, data);
            }, reject)
          } else {
            //不是promise对象
            proccessData(index, currentTask);
          }
        } else {
          //不是promise对象
          proccessData(index, currentTask);
        }
      }
    })
  }


}

//Promise A+ rule test 开始
// Promise.deferred = function () {
//   let dfd = {};
//   dfd.promise = new Promise((resolve, reject) => {
//     dfd.resolve = resolve;
//     dfd.reject = reject
//   })
//   return dfd;
// }

// module.exports = Promise;

//Promise A+ rule test 结束



// let p1 = new Promise((resolve, reject) => {
//   resolve('data');
//   //reject('error')
//   // setTimeout(() => {
//   //   resolve('data')
//   // }, 1000);
// });

// let p2 = p1.then(data => {
//   // return "123";
//   // return [1,2,3];
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('true');
//     }, 1000);
//   })
// }, err => {
//   console.log("this is faild method");
// });

// let p3 = p2.then(data => {
//   console.log("p2 success", data);
// }, err => {

// })


// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(new Promise((r, j) => {
//       r('hello')
//     }))
//   }, 1000);
// });

// p1.then(data => {
//   console.log(data);
// })

//Promise.all的测试:
// const fs = require('fs').promises;
// let p1 = Promise.all([2, fs.readFile('./name.txt', 'utf8'), fs.readFile('./age.txt', 'utf8'), 1, 3]).then(data => {
//   console.log("data==>", data);
// })


//promise.finally的测试:
let p1 = new Promise((resolve, reject) => {
  resolve("1")
}).then(data => {
  console.log("1then:", data);
  throw new Error("error")
}).finally(() => {
  console.log("in finally");
  return "2";
  //  throw new Error("111")
}).then(data => {
  console.log("2then:", data);
}, err => {
  console.log("err", err);
}).finally(() => {
  console.log("in finally2");
})