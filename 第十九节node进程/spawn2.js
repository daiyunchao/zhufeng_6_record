//引用一个孵化器spawn
const { spawn } = require('child_process');
const path = require('path');

//孵化一个叫cp的子进程用于执行node命令
let cp = spawn('node', ['a.js'], {
    cwd: path.join(__dirname),//要执行命令的文件的路径
 
    stdio:[0,1,2,'ipc'],//使用ipc的方式进行通信,进程间就可以通过postmessage和onmessage实现
});

//接收子进程的消息
cp.on('message',function(data){
    console.log("child process data==>",data);
})