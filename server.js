var fs = require('fs');
var redis = require('redis');
var express = require('express');

var client = redis.createClient();

var app = express();
var router = express.Router();

router.param('id', function(req, res, next, id) {
  next();
});

router.get('/:id', function(req, res) {
  client.get(req.params.id, function(err, reply) {
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
