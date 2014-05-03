var fs = require('fs');
var redis = require('redis');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]);
} else {
  var client = redis.createClient();
}

app.use(bodyParser());

router.param('id', function(req, res, next, id) {
  next();
});

router.get('/:id', function(req, res) {
  client.get(req.params.id, function(err, reply) {
    if (!err) {
      res.send(reply);
    }
  });
})

router.post('/:id', function(req, res) {
  var value = req.body.value;
  client.set(req.params.id, value, function(err, reply) {
    if (!err) {
      res.send(200, 'SUCCESS');
    }
  });
});

app.use('/', router);

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err);
    res.send(500, 'ERROR!');
  }
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d...', server.address().port);
});
