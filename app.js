const express = require('express')
const app = express();
const cookieSession = require('cookie-session')
const passport = require('passport')
const http = require('http').Server(app);
// const io = require('socket.io')(http,  { cors: { origin: '*' } });
require('dotenv').config()
const port = process.env.PORT

require("./config/database")

/**
 * Cookie
 */
app.use(cookieSession({
  name: 'mysession',
  keys: ['vueauthrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(passport.initialize())
app.use(passport.session())
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(express.static('public'))
app.use(require("./routes/index"))
require("./config/passport")

 
http.listen(process.env.PORT, function () {
  console.log('Server started on port ' + process.env.PORT);
  // io.on('connection', (socket) => {
  //   io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  // });
});