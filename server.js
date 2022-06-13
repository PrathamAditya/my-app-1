//comman js syntax commaly used in node
const express  = require('express')
const app = express();
const http = require('http')
const { Server } = require('socket.io');
const server = http.createServer(app);
const ACTIONS = require('./src/Actions');

const io = new Server(server);
const userSocketMap = {};
function getAllConnectedClients(roomId){
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
          return {
                  socketId,
                  username:userSocketMap[socketId],
                };
  });
}

io.on('connection', (socket) =>{
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({roomId, username}) =>{
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    //gettting list of all the client on the server
    const clients = getAllConnectedClients(roomId);
    //notifing all the cleints
    clients.forEach(({socketId}) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId:socket.id,

      });


    });

  });
  socket.on(ACTIONS.CODE_CHANGE , ({roomId, code}) =>{
    //emmiting this in the room
    //expect me emmit the code
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
  })


  //Listening the event
  socket.on('disconnecting' , () =>{
    //converting the map into array
    const room = [...socket.rooms];
    //broadcasting the msg this user is disconnected
    room.forEach((roomId)=>{
      socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId: socket.id,
            username: userSocketMap[socket.id],
      });

    });
    delete userSocketMap[socket.id];
    socket.leave();

  });
});




const PORT = process.env.PORT|| 5000;
server.listen(PORT , () => console.log(`Listening on port ${PORT}`));
