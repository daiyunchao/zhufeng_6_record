let context = {

};

let defineGetter = function (property, key) {
  context.__defineGetter__(key, function () {
    return this[property][key];
  });
}

let defineSetter = function (property, key) {
  context.__defineSetter__(key, function (newValue) {
    this[property][key] = newValue;
  });
}
defineGetter('request', 'url');
defineGetter('request', 'method');
defineGetter('request', 'path');
defineGetter('response','body')
defineSetter('response','body')
module.exports = context;