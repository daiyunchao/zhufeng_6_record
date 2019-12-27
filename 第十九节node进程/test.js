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