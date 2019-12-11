const http = require('http');
const Router = require('./router')

/**
 * 负责创建一个appliaction
 */
class Application {
    constructor() {
        this.router = new Router();
    }

    handlerRequest(req,res) {
        this.router.handlerRequest(req,res);
    }

    //对应 handler可以是多个函数的情况
    get(path, ...handler) {
        this.router.get({
            path,
            method: "get",
            handler
        })
    }

    listen(...args) {
        let server = http.createServer(this.handlerRequest.bind(this));
        server.listen(...args);
    }
}

module.exports = Application;