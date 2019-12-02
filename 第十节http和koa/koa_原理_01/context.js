let context = {

};

let defineGetter = function (property, key) {
  context.__defineGetter__(key, function () {
    return this[property][key];
  });
}
defineGetter('request', 'url');
defineGetter('request', 'method');
module.exports = context;