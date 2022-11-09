const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../Model/Employee')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  
  (username, password, done) => {
    UserModel.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      let verifyPassword= bcrypt.compareSync(password, user.password);
      if (!verifyPassword) { return done(null, false,  {message: 'Incorrect username or password'}); }
      return done(null, user);
    });
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
  let user = await UserModel.findById(id).exec();
  done(null, user)
})