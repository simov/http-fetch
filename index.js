
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
      .then((res) => {
        if (options.encoding === 'binary') {
          res.blob().then((body) => options.callback(null, res, body))
        }
        else if (!options.parse) {
          res.text().then((body) => options.callback(null, res, body))
        }
        else if (options.parse.json) {
          res.json().then((body) => options.callback(null, res, body))
        }
      })
      .catch((err) => {
        options.callback(err)
      })
  }
  else {
    return promise
      .then((res) => {
        if (options.encoding === 'binary') {
          return res.blob().then((body) => Promise.resolve([res, body]))
        }
        else if (!options.parse) {
          return res.text().then((body) => Promise.resolve([res, body]))
        }
        else if (options.parse.json) {
          return res.json().then((body) => Promise.resolve([res, body]))
        }
      })
  }
}
