
var qs = require('qs')
var Headers = require('@request/headers')

function dcopy (obj) {
  return JSON.parse(JSON.stringify(obj || {}))
}


module.exports = (deps) => (options) => {
  deps = deps || {}

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
  var headers = new Headers(dcopy(options.headers))

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
    if (!headers.get('content-type')) {
      headers.set('content-type', 'application/x-www-form-urlencoded')
    }
  }

  if (options.json) {
    if (typeof options.json === 'object') {
      init.body = JSON.stringify(options.json)
    }
    else if (typeof options.json === 'string') {
      init.body = options.json
    }
    if (!headers.get('content-type')) {
      headers.set('content-type', 'application/json')
    }
  }

  if (options.auth) {
    if (options.auth.bearer) {
      headers.set('authorization', 'Bearer ' + options.auth.bearer)
    }
  }

  if (options.parse) {
    if (options.parse.json) {
      headers.set('accept', 'application/json')
    }
  }

  if (options.multipart && deps.multipart) {
    var opts = {
      multipart: options.multipart,
      contentType: headers.get('content-type'),
      preambleCRLF: options.preambleCRLF,
      postambleCRLF: options.postambleCRLF
    }

    var boundary = deps.multipart.getBoundary(opts)
    headers.set('content-type', deps.multipart.getContentType(opts, boundary))

    var body = deps.multipart.build(opts, boundary)
    init.body = body.reduce((prev, curr) => prev + curr, '')
  }

  init.headers = headers.toObject()
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
