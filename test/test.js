
var http = require('http')
var should = require('assert')
var request = require('../')


describe('fetch', () => {
  var server, socket

  before((done) => {
    server = http.createServer()
    server.on('connection', (_socket) => (socket = _socket))
    server.on('request', (req, res) => {
      res.end(req.url)
    })
    server.listen(6767, done)
  })

  it('qs', (done) => {
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

  after((done) => {
    server.close(done)
    socket.destroy()
  })
})
