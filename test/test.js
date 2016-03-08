
var http = require('http')
var should = require('assert')
var request = require('../')


describe('fetch', () => {
  var server, socket

  before((done) => {
    server = http.createServer()
    server.on('connection', (_socket) => (socket = _socket))
    server.listen(6767, done)
  })

  it('qs object', (done) => {
    server.once('request', (req, res) => res.end(req.url))
    request({
      method: 'GET',
      url: 'http://localhost:6767',
      qs: {a: 1},
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, '/?a=1')
        done()
      }
    })
  })

  it('qs string', (done) => {
    server.once('request', (req, res) => res.end(req.url))
    request({
      method: 'GET',
      url: 'http://localhost:6767',
      qs: 'a=1',
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, '/?a=1')
        done()
      }
    })
  })

  it('form object', (done) => {
    server.once('request', (req, res) => req.pipe(res))
    request({
      method: 'POST',
      url: 'http://localhost:6767',
      form: {a: 1},
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, 'a=1')
        done()
      }
    })
  })

  it('form string', (done) => {
    server.once('request', (req, res) => req.pipe(res))
    request({
      method: 'POST',
      url: 'http://localhost:6767',
      form: 'a=1',
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, 'a=1')
        done()
      }
    })
  })

  it('json object', (done) => {
    server.once('request', (req, res) => req.pipe(res))
    request({
      method: 'POST',
      url: 'http://localhost:6767',
      json: {a: 1},
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, '{"a":1}')
        done()
      }
    })
  })

  it('json string', (done) => {
    server.once('request', (req, res) => req.pipe(res))
    request({
      method: 'POST',
      url: 'http://localhost:6767',
      json: '{"a":1}',
      callback: (err, res, body) => {
        if (err) return done(err)
        should.equal(body, '{"a":1}')
        done()
      }
    })
  })

  after((done) => {
    server.close(done)
    socket.destroy()
  })
})
