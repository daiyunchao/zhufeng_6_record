//引用一个孵化器spawn
const { spawn } = require('child_process');
const path = require('path');

//孵化一个叫cp的子进程用于执行node命令
let cp = spawn('node', ['a.js'], {
    cwd: path.join(__dirname),//要执行命令的文件的路径
    // stdio:"ignore",//默认进程间是不通讯的
    //进程间的通讯 设置为: 输入流 输出流 错误流
    // stdio: [process.stdin, process.stdout, process.stderr]//也可以被简化成stdio: [0, 1, 2]

    stdio:'pipe',//通过管道的方式进行通信,一旦使用管道的方式去通信了,就可以监听on('data')
});
 
cp.stdout.on('data',function(data){
    console.log("this is cp data==>",data.toString());
    
})
//当子进程出现错误的时候会被调用
cp.on('error', function () {
    console.log("error");
})

//当子进程退出的时候会被调用
cp.on('exit', function () {
    console.log("exit");
})

//当子进程关闭的时候会被调用
cp.on('close', function () {
    console.log("close");
})