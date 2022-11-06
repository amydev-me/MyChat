const express = require('express')
const app = express(); 
const http = require('http').Server(app);
// const io = require('socket.io')(http,  { cors: { origin: '*' } });
require('dotenv').config()
const port = process.env.PORT
 
require("./config/database")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
 
app.use(express.static('public'))
app.use(require("./routes/index"))
 
http.listen(process.env.PORT, function () {
  console.log('Server started on port ' + process.env.PORT);
  // io.on('connection', (socket) => {
  //   io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  // });
});