
// I worked on this code as part of a coding bootcamp curriculum. I followed along with the instructions 
// (i.e. followed/copied instructions from the course/instructors and didn't design everything from scratch myself) while
//  writing code in this project/file. Moreover, I  acknowledge receiving support from and/or working/collaborating
//   with instructors/classmates, generally as is expected from being a participant in the coding bootcamp.


const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');


const router = express.Router();

/* GET users listing. */


router
  .route("/")
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => next(err));
  });


// router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
//   User.find({})
//   .then( (users) => {
//       // res.statusCode = 200;
//       // res.setHeader("Content-Type", "application/json");
//       res.json(users);
//   })
//   .catch( (err) => next(err));
// });


router.post("/signup", cors.corsWithOptions, async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    await User.register(user, req.body.password);

    try {
      await user.save();
      passport.authenticate("local")(req, res, () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, status: "Registration Successful!" });
      });
    } catch (saveErr) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: saveErr });
    }
  } catch (registerErr) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.json({ err: registerErr });
  }
});


router.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }

});


module.exports = router;
