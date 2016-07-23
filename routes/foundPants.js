var express = require('express');
var router = express.Router();

/* GET found pants page. */
router.get('/', function(req, res, next) {
  res.render('foundPants', { title: 'Found Pants' });
});

module.exports = router;
