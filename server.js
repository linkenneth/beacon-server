var fs = require('fs');
var redis = require('redis');
var express = require('express');

var app = express();
var router = express.Router();

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]);
} else {
  var client = redis.createClient();
}

router.param('id', function(req, res, next, id) {
  next();
});

router.get('/:id', function(req, res) {
  redis.get(req.params.id, function(err, reply) {
    if (!err) {
      res.send(reply);
    }
  });
});

app.use('/', router);

app.use( function(err, req, res, next) {
  if (err) {
    res.send(500, 'ERROR!');
  }
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d...', server.address().port);
});
