
var qs = require('qs')


module.exports = (options) => {

  var url = options.url
  var init = {}

  if (options.qs) {
    if (typeof options.qs === 'object') {
      url = url + '?' + qs.stringify(options.qs)
    }
    else if (typeof options.qs === 'string') {
      url = url + '?' + options.qs
    }
  }

  if (options.method) {
    init.method = options.method
  }

  if (options.form) {
    if (typeof options.form === 'object') {
      init.body = qs.stringify(options.form)
    }
    else if (typeof options.form === 'string') {
      init.body = options.form
    }
  }

  var promise = fetch(new Request(url, init))

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
