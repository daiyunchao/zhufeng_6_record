### Node进程
#### spawn 可用于大文件因为可以使用`pipe`
- 问题:cpu密集型的问题 单线程,会导致线程被占用,一个请求卡住了,导致后面的请求都进不来
```javascript
//计算型,cpu密集型
const http=require('http');

//计算型,cpu密集型
let app=http.createServer((req,res)=>{
    if(req.url=='/sum'){
        let total=0;
        for (let i = 0; i < 100000000000000; i++) {
            total+=i;
        }
        res.end('total-->',total)
    }
    else{
        res.end('ok')
    }
});
app.listen(3000)
```

- 如何解决这个问题? 使用`spawn`开启子进程,去让子进程去做这些计算,不影响主进程的正常运行
```javascript
//一个使用spawn的小例子:

//引用一个孵化器spawn
const { spawn } = require('child_process');
const path = require('path');

//孵化一个叫cp的子进程用于执行node命令
let cp = spawn('node', ['a.js'], {
    cwd: path.join(__dirname),//要执行命令的文件的路径
    // stdio:"ignore",//默认进程间是不通讯的
     
    //进程间的通讯 设置为: 输入流 输出流 错误流
    //但这种方式不能获取到执行结果,只能是一些日志打印等输入输出
    // stdio: [process.stdin, process.stdout, process.stderr]//也可以被简化成stdio: [0, 1, 2]

    //通过管道的方式进行通信,一旦使用管道的方式去通信了,就可以监听on('data')
    stdio:'pipe',
});

//这里监听的是cp.stdout 则 在执行文件返回值中也应该是
//proccess.stdout.write('xxx') 返回结果
//可以监听 cp.stdin.on 同样的执行文件也应该是 cp.stdin.write
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
```

```javascript
//使用ipc的方式进行服务器之间的通讯
//引用一个孵化器spawn
const { spawn } = require('child_process');
const path = require('path');

//孵化一个叫cp的子进程用于执行node命令
let cp = spawn('node', ['a.js'], {
    cwd: path.join(__dirname),//要执行命令的文件的路径
 
    //前面的0,1,2 是什么呢? 0是:process.stdin的简写, 1是:process.stdout的简写, 2是:process.stderr的简写
    //这样就既可以使用 send或是message的方式进行通信 也可以共享process拿到console信息
    stdio:[0,1,2,'ipc'],//使用ipc的方式进行通信,进程间就可以通过postmessage和onmessage实现
});

//接收子进程的消息
//在子进程中发消息使用: process.send('this is message')
cp.on('message',function(data){
    console.log("child process data==>",data);
})
```

- 子进程是依赖于父进程的,当父进程退出,子进程将自动退出,有什么办法可以让子进程独立出来吗?
```javascript
const { spawn } = require('child_process');
const path = require('path');

//孵化一个叫cp的子进程用于执行node命令
let cp = spawn('node', ['a.js'], {
    cwd: path.join(__dirname),//要执行命令的文件的路径
    stdio:'ignore',//忽略
    detached:true,//是否是独立的:true
});

//主进程表示:放弃子进程
cp.unref();

//如何才能关闭这个不受控制的子进程呢?
//根据 cp.pid 去手动结束进程
//但这种方式,进程间是不能通信的
```
改进最初以为cpu密集型而堵塞进程的代码
```javascript
const http = require('http');
const { spawn } = require('child_process')
//计算型,cpu密集型
//将计算抛给子进程,主进程就不会一个被卡住而堵塞主进程
let app = http.createServer((req, res) => {
    if (req.url == '/sum') {
        //直接将运算抛给子进程
        let cp = spawn('node', ['sum.js'], {
            cwd: path.join(__dirname),
            stdio: [0, 1, 2, 'ipc']
        });

        //当子进程执行完了再返回数据
        cp.on('message', function (data) {
            res.end('total-->', total)
        })
    }
    else {
        res.end('ok')
    }
});
app.listen(3000)

//sum.js
let total = 0;
for (let i = 0; i < 100000000000000; i++) {
    total += i;
}
process.send(total);
//计算好了以后主动退出:
process.exit();
```

#### fork
- fork是`spawn`的`ipc`简化版
```javascript
const { fork } = require('child_process')
let cp = fork('sum.js', {
            cwd: path.join(__dirname)
        });
//默认就是使用的ipc通讯方式
```

#### execFile 执行命令行,并将结果进行整合再输出(结果要小于200kb),也是对spwan的封装
```javascript
let {execFile,exec}=require('child-process');
execFile('node',['--V'],(err,stdout,stderr)=>{
    console.log(stdout)
})

//会启动一个新的shell,一般适用于命令
exec('node --V',(err,stdout,stderr)=>{
console.log(stdout)
})
```

#### Cluster
> Cluster的原理:
- node中去获取系统的cpu的个数(4核)
`const cpus =require('os').cpus().length`

- 使用fork,子进程监听同一个端口号:
```javascript
//index.js
let http=require('http');
let {fork}=require('child-process')
let path=require('path');
let cpus=require('os').cpus().length;
let server=http.createServer((req,res)=>{
}).listen(3000);

//实现一个cpu启动一个服务
for(let i=0;i<cpus-1;i++){
    let cp=fork('server.js',{cwd:path.join(__dirname)});
    //发送一个server给子进程,子进程监听服务,这样就能子进程和父进程同时监听一个端口号
    cp.send('server',server)
}


//server.js
let http=require('http');
//接收父进程的消息,当发送一个server来的时候,将会在第二个参数中
process.on('message',(data,server){
    //当我监听server的时候,就可以监听父进程相同的端口
    http.createServer((req,res)=>{
    }).listen(server);
})
```

- 为了方便node提供了Cluster来实现集群
```javascript
const cluster=require('cluster');
let http=require('http');
let cpus=require('os').cpus().length;

//判断当前是否是守护进程
if(cluster.isMaster){
    //可监听子进程的状态:
    cluster.on('exit',function(worker){
        log('worker pid==>'.worker.process.pid);
        //如果有子进程挂了,再启动一个
        cluster.fork();
    })
    //当执行cluster的fork方法时就会执行else的代码
    for(let i=0;i<cpus;i++){
        cluster.fork();
    }
}
}else{
    //守护进程有几个fork,就启动几个进程,并且同时监听同一个端口
    http.createServer((req,res)=>{
    }).listen(3000);
}
```

### PM2
```javascript
//监听文件变化,自动重启
pm2 start xxx.js --watch

//使用pm2启动npm的命令(启动package.json的run dev命令)
pm2 start npm --run dev

//清除pm2的命令
sudo npm cache clean --fore

//自动通过cpu个数启动服务进程数量 负载均衡
pm2 start xx.js -i max

//为进程取一个名字
pm2 start --name xxx

//自动生成一个配置文件
pm2 init 
```
