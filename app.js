const express = require('express')
const app = express();

const port_1 = 8080;

const path = require('path');

connections = [];



// i tried to implemnt the pm2 and create instances of node.
// i understand the importent of create multiple instances of node,to scaled  the the app and create Load-Balancing. 
// i created another chat app with Mean stack here : https://meanchat2019.herokuapp.com/
// I'd love to get feedback even if i not passed the test!





// Create routes
const usersRouter = require('./Routes/users');
app.use('/users', usersRouter);


// the server host the react static files
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// instance of server to socket.io
const server = app.listen(port_1, () => console.log(`listening on port ${port_1}!`))

// create io to use socket.io
 const io = require('socket.io').listen(server);

 // method that check if user connect
io.on('connection',(socket,data) =>{

  var socketId = socket.id;
  // socket.emit('connect',{user:data.user});

  console.log('connection to socket 1');


  // handle connection users and emit to client
    socket.on('join', function(data){
        console.log(socketId);
        if(!connections.includes(data.user)){
          console.log(data.user);
          connections.push({username:data.user,socketid:socketId});
          console.log(connections);
          io.emit('connections',connections);
        }

    });

      // handle in users how want to open chat with another user
      socket.on('openChatWith',function(data){
        io.to(data.chatWith).emit('message',{user:data.me,message:'Open Chat with you!'});
       
      });


    //  handle in messages and send them to specific user they want
    socket.on('message',function(data){
    
      io.to(data.chatWith.socketid).emit('message',{user:data.chatWithName,message:data.message});
  
    });


  });








