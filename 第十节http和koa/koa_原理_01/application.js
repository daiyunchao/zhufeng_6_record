const http = require('http');
const context = require('./context');
const request = require('./request.js');
const response = require('./response');
class Application {
  constructor() {
    this.handlers = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    console.log("this.request ==>", this.request,request);

    this.response = Object.create(response);
    this.context.request = this.request;
    this.context.response = this.response;
  }
  handlerRequest(req, res) {
    this.context.req = req;
    this.context.res = res;
    this.context.request.req = req;
    this.context.response.res = res;
    while (this.handlers.length > 0) {
      let currentHandler = this.handlers.pop();

      currentHandler(this.context)
    }
  }
  use(handler) {
    this.handlers.push(handler)
  }
  listen(...args) {
    http.createServer(this.handlerRequest.bind(this)).listen(...args);
  }
}
module.exports = Application;