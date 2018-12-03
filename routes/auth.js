var express = require('express');
var router = express.Router();
const str = require('../strings');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');


router.get('/sign-up', (req, res, next) => {
    res.render('index', { o: {
        title: str.TITLE, signup: true
    }});
});

router.post('/register', async (req, res, next) => {
    const { email, password, fullname, phone } = req.body;
    const exist = await User.findOne({ email });

    if(exist){
        res.json({ error: str.USER_EXIST });
    }else{
        const user = new User({
            email,
            password,
            fullname,
            phone
        });
          
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, async (err, hash) => {
            // Hash Password
            user.password = hash;
            // Save User
            try {
              const newUser = await user.save();
              res.json({ success: str.SIGN_UP_SUCCESS, user: newUser });
              //render here
            } catch (err) {
              console.log('save error:',err)
              res.json({ error: err.message });
            }
          });
        });
    }
});

// Auth User
router.post('/sign-in', async (req, res, next) => {

    const { email, password } = req.body;

    try {
      // Authenticate User
      const user = await auth.authenticate(email, password);
      
      // Create JWT
      const token = jwt.sign({_id: user.toJSON()._id}, config.JWT_SECRET, {
        expiresIn: '1d'
      });

      //const { iat, exp } = jwt.decode(token);
      //console.log('decode token',jwt.decode(token));
      // Respond with token
      res.json({ 
        token,
        user,
        success: str.SIGN_IN_SUCCESS
      });
    } catch (err) {
      // User unauthorized
      console.log('Sign-in error',err)
      res.json({
          error: err.message
      });
    }
  });


module.exports = router;
