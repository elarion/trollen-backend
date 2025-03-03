var express = require('express');
var router = express.Router();

/* GET messages of a Room. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
