
var t = require('assert')
var http = require('http')
var formidable = require('formidable')
var request = require('../../')({
  multipart: require('@purest/multipart')({
    path: require('path'),
    mime: require('mime-types'),
    isstream: () => false,
    // random: require('node-uuid'),
    random: () => {
      // This generates a 50 character boundary similar to those used by Firefox
      // They are optimized for boyer-moore parsing
      var boundary = '--------------------------'
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16)
      }
      return boundary
    },
  })
})


describe('multipart', () => {
  var server, socket

  before((done) => {
    server = http.createServer()
    server.on('connection', (_socket) => (socket = _socket))
    server.listen(6767, done)
  })

  it('form-data - string', (done) => {
    server.once('request', (req, res) => {
      var form = new formidable.IncomingForm()
      form.parse(req, (err, fields, files) => {})
      form.onPart = (part) => part.pipe(res)
    })
    request({
      method: 'POST',
      url: 'http://localhost:6767',
      multipart: {key: 'value'}
    })
      .then((result) => {
        var res = result[0], body = result[1]
        t.equal(body, 'value')
        done()
      })
      .catch(done)
  })

  after((done) => {
    server.close(done)
    socket.destroy()
  })
})
