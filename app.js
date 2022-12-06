const express = require('express')
const app = express(); 
const http = require('http').Server(app);
const io = require('socket.io')(http,  { cors: { origin: '*' } });
global.io = io;
require('dotenv').config()
const port = process.env.PORT
 
require("./Config/database")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
 
 
app.use(express.static('public'))
app.use(require("./routes/index"))
const PORT = process.env.PORT|| 3000
http.listen(PORT, function () {
  console.log('Server started on port ' + PORT);
  // io.on('connection', (socket) => {
  //   io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  // });
});