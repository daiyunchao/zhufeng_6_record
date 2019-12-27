let total = 0;
for (let i = 0; i < 100000; i++) {
    total += i;
}
// console.log("total===>", total);

//pipe的方式:向标准输出流中写入数据,外面就能通过 on data去监听到管道中的数据
// process.stdout.write(total+'');

//ipc的方式
//发送到父进程中:
process.send(total)
