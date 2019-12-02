let response = {
  _body: '',
  get body() {
    return this._body;
  },
  set body(body) {
    this._body = body;
  }
};
module.exports = response;