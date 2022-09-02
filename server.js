

var express = require('express');
var app = express();


var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/MYDB";
const mongo = require("mongoose");
var myModule = require('./model2.js');
const Chats = myModule.Chats;

const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


// const http = require('http').createServer(app);
// const io = require("socket.io")(http);

const server= http.createServer(function (req, res) {
    var flag;
    var chatsArr=[];
    var db = mongo.connect(mongoPath, function (err, response) {
        flag=response;
    if (err) {
        console.log("connection faild...." + err)
    }
    else {
        if (err) throw err;
        console.log("connected to" + db, "+", response);
    }

    
//   response.collection("chats").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('Hello World!'+JSON.stringify(result));
//     res.end();
// })
   
})

res.writeHead(200, {'Content-Type': 'text/html'});

switch (req.url) {
    case "/api/books":
        res.writeHead(200);
        // res.end(books);
        res.end(`{"message": "This is a books"}`);
        break
    case "/api/authors":
        res.writeHead(200);
        // res.end(authors);
        res.end(`{"message": "This is a author"}`);
        break
    case "/api/allMessage":
             
Chats.find({},function(err, result) {
    if (err) throw err;
    console.log(result);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!'+JSON.stringify(result));
    res.end();
})
        break
    // default:
        // res.writeHead(404);
        // res.end(JSON.stringify({error:"Resource not found Rishu"}));
        
// Chats.find({},function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('Hello World!'+JSON.stringify(result));
//     res.end();
// })
}
  
}).listen(process.env.PORT || 8000);


const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});





let userList = new Map();

io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    var activeUser=userName;
    addUser(userName, socket.id);
    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);
  
    Chats.find().then(result => {
        // socket.emit('message-broadcast', result)
        io.emit('message-broadcast', result)
    })


    socket.on('message', (msg) => {
        let currentTime=new Date();
        let trimTime=currentTime.toString().slice(4,21)
        console.log("add appi = " + JSON.stringify(msg))
        const message = new Chats({ message: msg, sender_id: userName ,time:trimTime})
        message.save().then(() => {
            // io.emit('message-broadcast', msg);
            Chats.find().then(result => {
                io.emit('message-broadcast', result)
            })
            // socket.emit('message-broadcast', {message: msg, sender_id: userName});
        })
        // socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
        socket.emit('output-message', {message: msg, sender_id: userName});
    })


    // socket.on('message', (msg) => {
    //     socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    // })
    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    })
});

function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
  
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}




