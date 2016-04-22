
var qs = require('qs')


module.exports = (modules) => (options) => {

  var url = options.url

  if (options.qs) {
    if (typeof options.qs === 'object') {
      url = url + '?' + qs.stringify(options.qs)
    }
    else if (typeof options.qs === 'string') {
      url = url + '?' + options.qs
    }
  }

  var init = {}
  options.headers = options.headers || {}
  init.headers = options.headers

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
    if (!options.headers['content-type']) {
      options.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
  }

  if (options.json) {
    if (typeof options.json === 'object') {
      init.body = JSON.stringify(options.json)
    }
    else if (typeof options.json === 'string') {
      init.body = options.json
    }
    if (!options.headers['content-type']) {
      options.headers['content-type'] = 'application/json'
    }
  }

  if (options.auth) {
    if (options.auth.bearer) {
      init.headers.authorization = 'Bearer ' + options.auth.bearer
    }
  }

  if (options.parse) {
    if (options.parse.json) {
      init.headers['accept'] = 'application/json'
    }
  }

  init.mode = 'cors'
  var promise = fetch(new Request(url, init))

  if (options.callback) {
    promise
      .catch((err) => options.callback(err))
      .then((res) => {
        var p
        if (options.encoding === 'binary') {
          p = res.blob()
        }
        else if (!options.parse) {
          p = res.text()
        }
        else if (options.parse.json) {
          p = res.json()
        }
        p.then((body) => options.callback(null, res, body))
      })
  }
  else {
    return promise
      .then((res) => {
        var p
        if (options.encoding === 'binary') {
          p = res.blob()
        }
        else if (!options.parse) {
          p = res.text()
        }
        else if (options.parse.json) {
          p = res.json()
        }
        return p.then((body) => Promise.resolve([res, body]))
      })
  }
}
