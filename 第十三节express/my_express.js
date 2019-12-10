const http = require('http');
const url = require('url')

function express() {
    let routerpaths = [{
        path: "*",
        method: "*",
        callback(req, res) {
            res.end(`Cant not ${req.method} ${url.parse(req.url).pathname}`)
        }
    }];
    let handleRequest = function (req, res) {
        let {
            pathname
        } = url.parse(req.url);
        if (pathname === '/favicon.ico') {
            res.end();
        }
        let m = req.method;
        for (let index = 1; index < routerpaths.length; index++) {
            let {
                path,
                method,
                callback
            } = routerpaths[index];
            m = m.toLowerCase();
            console.log(method, path, pathname);

            if (path === pathname && method == m) {
                return callback(req, res)
            }
        }
        routerpaths[0].callback(req, res);
    }
    let app = http.createServer(handleRequest);

    app.get = function (path, callback) {
        routerpaths.push({
            path,
            method: 'get',
            callback
        });
    }
    return app;
}

module.exports = express;