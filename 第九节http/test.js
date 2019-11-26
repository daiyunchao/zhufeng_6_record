//封装成静态资源服务器
const http = require('http');
const url = require('url');
const path = require('path')
const fs = require('fs').promises;
const mime=require('mime')
const { createReadStream } = require('fs');

class StaticServer {
  async handlerRequest(req, res) {
    console.log(req.url);

    let { pathname } = url.parse(req.url);
    let filepath = path.join(__dirname, pathname);
    try {
      let stat = await fs.stat(filepath);
      if (stat.isFile()) {
        this.sendFile(filepath, res);
      } else {
        filepath = path.join(filepath, 'index.html');
        await fs.access(filepath);
        this.sendFile(filepath, res)
      }
    } catch (error) {
      return this.sendError(error, res);
    }
  }
  sendFile(filepath, res) {
    res.statusCode = 200;
    let type = mime.getType(filepath);
    res.setHeader('Content-Type', `${type};charset:utf-8`);
    createReadStream(filepath).pipe(res);
  }
  sendError(e, res) {
    res.statusCode = 404;
    let type = mime.getType('.txt');
    res.setHeader('Content-Type', `${type};charset:utf-8`);
    res.end('Not Found');
  }
  start(...args) {
    //监听服务器
    http.createServer(this.handlerRequest.bind(this)).listen(...args);
  }
}

new StaticServer().start(3000, () => {
  console.log(`port 3000 start`);
})
