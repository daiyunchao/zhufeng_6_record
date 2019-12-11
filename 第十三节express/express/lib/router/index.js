const url = require('url')
class Router {
    constructor() {
        this.stacks = [];
    }

    //收到请求时
    get(route) {

        //如果handler是数组,则平扁该数组,构建多个route方便匹配
        if (route && route.handler && Array.isArray(route.handler)) {
            for (let index = 0; index < route.handler.length; index++) {
                const item = route.handler[index];
                let itemRoute = {
                    path: route.path,
                    method: route.method,
                    handler: item
                }
                this.stacks.push(itemRoute);
            }
        } else {
            this.stacks.push(route);
        }
    }

    //如果没找到路由的话
    notFoundRouter(req, res) {
        let m = req.method;
        let {
            pathname
        } = url.parse(req.url);
        res.end(`Cant ${m} ${pathname}`)
    }

    //处理请求
    handlerRequest(req, res) {
        let {
            pathname
        } = url.parse(req.url);
        let m = req.method;
        m = m.toLowerCase();

        //有next的情况 单层的情况
        let index = 0;
        let next = () => {
            //当前要执行的这一个
            if (index === this.stacks.length) {
                //找完了还没找到
                return this.notFoundRouter(req, res);
            }
            let layer = this.stacks[index++];
            let {
                path,
                method,
                handler
            } = layer;
            //找到了匹配的路由:
            if (method === m && path === pathname) {
                handler(req, res, next);
            } else {
                //如果不匹配,找下一个
                next();
            }
        }
        next()

        //没有next的情况可使用:
        // for (let i = 0; i < this.stacks.length; i++) {
        //     const route = this.stacks[i];
        //     let {
        //         path,
        //         method,
        //         handler
        //     } = route;
        //     if (method === m && path === pathname) {
        //         return handler(req, res);
        //     }
        // }
        //this.notFoundRouter(req, res);
    }
}

module.exports = Router;