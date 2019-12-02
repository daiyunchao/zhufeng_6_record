let reqeust = {
  get url() {
    console.log("in get url==>");
    return this.req.url;
  },
  get method() {
    return this.req.method;
  }
};

module.exports = reqeust;