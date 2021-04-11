var express = require('express');
var router = express.Router();
var videoslack = require('../views/video')


/* GET home page. */
router.get('videocall', videoslack.video);

module.exports = router;
