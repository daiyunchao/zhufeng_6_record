setTimeout(() => {
  console.log("time0");
  Promise.resolve().then(() => {
    console.log("then0");
  })
});//放入宏任务

setTimeout(() => {
  console.log("time1");
});//放入宏任务

Promise.resolve().then(() => {
  console.log("then1");
})//放入微任务

Promise.resolve().then(() => {
  console.log("then2");
})//放入微任务


//执行jS主栈 将settimeout放入宏任务 promise.then放入微任务
//js主栈执行完成,清空微任务列表 then1 then2 被执行
//从宏任务中拿出第一个settimeout并执行 打印time0 并将then0 放入微任务
//js主栈执行完成,清空微任务列表 then0被执行
//从宏任务中拿出第二个settimeout并执行打印time1
