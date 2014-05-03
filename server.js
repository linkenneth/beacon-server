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
    if (err) {
      // TODO don't return stack trace and show all the files on your computer
      res.send('ERROR!');
    } else {
      res.send(reply);
    }
  });
});

app.use('/', router);

var server = app.listen(3000, function() {
  console.log('Listening on port %d...', server.address().port);
});
