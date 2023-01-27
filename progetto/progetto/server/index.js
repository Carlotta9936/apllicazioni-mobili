const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  socket.on('join', function(room,nome) {
    console.log('stanza'+room);
    socket.join(room);
    //informo quale client si è connesso
    io.to(room).emit('message', "server: "+nome+" si è connesso");
    socket.on('message', async (message) => {
      io.to(room).emit('message', `${message}`);
      console.log(message);
    });
  });
  console.log("new connection ");

  //informo quale client si è disconnesso
  socket.on('leave',function(room, nome){
    io.to(room).emit('message', "server: "+nome+" si è disconnesso");
    socket.leave(room);
    console.log("disconnesso")
  });

  //cancello tutti i clients conllegati alla stanza
  socket.on('delete',function(room){
    socket.leave(room);
    io.in(room).socketsLeave(room);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});


httpServer.listen(port, () => console.log(`listening on port ${port}`));