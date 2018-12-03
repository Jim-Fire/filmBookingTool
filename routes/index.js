var express = require('express');
var router = express.Router();
const str = require('../strings');
let Film = require('../models/Film');

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { o: {
    signin: true
  }});
});

router.get('/album', async (req, res, next) => {
  
  const receivedAlbums = await Film.find({});

  res.render('index', { o: {
    album: true,
    receivedAlbums
  }});
});

module.exports = router;
