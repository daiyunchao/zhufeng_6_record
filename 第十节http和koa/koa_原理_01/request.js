const Url = require('url')
let reqeust = {
  get url() {
    console.log("in get url==>");
    return this.req.url;
  },
  get method() {
    return this.req.method;
  },

  get path() {
    return Url.parse(this.req.url, true).pathname;
  }
};

module.exports = reqeust;