const express = require("express");
const router = express.Router();
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const redis = require('redis');

// Create redis client
let client = redis.createClient('6379','127.0.0.1');

// connect the redis client
client.on('connect',function(){
  console.log('Connected to redis!')
});



// Default users in chat - there is no register option in this app - only sign-in
client.hmset('Tom', 'username', 'Tom');
client.hmset('CodeOasis', 'username', 'CodeOasis');
client.hmset('Test', 'username', 'Test');

// used for extract data from body request
router.use(bodyparser());

// middleware  that checks whether a user exists in redis
router.post('/', function (req, res) {
   
let username = req.body.username;
  
    client.hgetall(username,function(err,object){
      if(!object){
        res.json({message:'Error!'});
      }else{
        const token = jwt.sign(
          {
            user: object.username,
          },
          "chat-CoadOasis",
          { expiresIn: "2h" }
        );
        res.json({message:'ok',Token: token,username:object.username});
      }
    })
    
  })


module.exports = router;
