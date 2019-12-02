const http = require('http');
const context = require('./context');
const request = require('./request.js');
const response = require('./response');
const Stream = require('stream')
class Application {
  constructor() {
    this.handlers = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    console.log("this.request ==>", this.request, request);

    this.response = Object.create(response);
    this.context.request = this.request;
    this.context.response = this.response;
  }
  async compose() {
    let index = 0;
    let dispath = async (index) => {
      if (index == this.handlers.length) {
        return;
      }
      await this.handlers[index](this.context, () => dispath(index += 1));
    }
    return dispath(index);
  }
  async handlerRequest(req, res) {
    this.context.req = req;
    this.context.res = res;
    this.context.request.req = req;
    this.context.response.res = res;
    await this.compose().then(() => {
      let body = this.context.body;
      let res = this.context.res;
      if (!body) {
        res.statusCode = 404;
        res.end('Not Found');
      } else if (typeof body === 'object') {
        res.end(JSON.stringify(body))
      } else if (body instanceof Stream) {
        body.pipe(res);
      } else {
        res.end(body);
      }
    });
  }
  use(handler) {
    this.handlers.push(handler)
  }
  listen(...args) {
    http.createServer(this.handlerRequest.bind(this)).listen(...args);
  }
}
module.exports = Application;