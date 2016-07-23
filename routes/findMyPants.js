var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('findMyPants', { title: 'Find My Pants' });
});

module.exports = router;
