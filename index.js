
var qs = require('qs')


module.exports = (options) => {

  var url = options.url
  if (options.qs) {
    url = url + '?' + qs.stringify(options.qs)
  }

  var request = new Request(url)

  if (options.method) {
    request.method = options.method
  }

  var promise = fetch(request)

  if (options.callback) {
    promise = promise
      .then((res) => {
        if (!options.parse) {
          return res.text().then((body) => {
            options.callback(null, res, body)
          })
        }
      })
      .catch((err) => {
        options.callback(err)
      })
  }

  return promise
}
