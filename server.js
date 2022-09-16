const bodyParser = require("body-parser");
const path = require("path")
const mongo = require("mongoose");
const nodemailer = require("nodemailer");//for email send...
var port = process.env.PORT || 8000;
var myModule = require('./model2.js');
const Chats = myModule.Chats;
const User = myModule.Users;
const express = require('express');
const cors = require('cors');
var https = require('https');
// var http = require('http');
const app = express();


const http = require('http').createServer(app);
// const io = require("socket.io")(http);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

// http.listen(process.env.PORT || 8000, () => {
//     console.log(`Server is running ${process.env.PORT || 8000}`);
// });

http.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running ${process.env.PORT || 8000}`);
});


// var server = http.Server(app);




// const server=http.createServer(app);
// server.listen(port);

// app.listen = function(){
//     var server = http.createServer(app);
//     console.log(`server is running on port ${port}`);
//     return server.listen.apply(port);
//   };

// app.listen(port, () => {
//     var server = http.createServer(this);
//     console.log(`server is running on port ${port}`);
//      return server.listen.apply(server, port);
  
//   });


// const http3 = http.createServer(app);


// app.listen(port, () => {
  
//     console.log(`server is running on port ${port}`);
//   });
  
// http3.listen(8000);

// http.createServer(app).listen(8000, ()=>{
//     console.log('server is runing at port 8000')
//   });


// const io = require('socket.io')(server, {
//     cors: {
//         origin: '*'
//     }
// });


app.use(cors({ origin: "*" }));
app.use(bodyParser.json());


// ---------
// const mongoPath = 'mongodb+srv://SenderChats:Rishu12345@cluster0.rwtbnbi.mongodb.net/?retryWrites=true&w=majority';
// const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';

const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var db = mongo.connect(mongoPath, function (err, response) {
    if (err) {
        console.log("connection faild...." + err)
    }
    else {
        console.log("connected to" + db, "+", response);
    }
})

// Serve only the static files form the dist directory
app.use(express.static('./dist/chatapp'));

// http.listen(port, () => {
//     console.log(`Server is running ${process.env.PORT || 8000}`);
// });



// app.listen(port, () => {
//     // var server = http1.createServer(this);
//     // return server.listen.apply(server, arguments);
//     console.log(`server is running on port ${port}`);
//   });
  

//   app.listen = function(){
//     var server = http1.createServer(this);
//     return server.listen.apply(server, port);
//   };

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
        console.log("message = " + JSON.stringify(msg.message)+" time"+msg.time)
        const message = new Chats({ message: msg.message, sender_id: userName, receiver_id:msg.receiver_id, time:msg.time})
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



app.post("/api/deleteAllChat", function (req, res) {
    // model2.remove( { } );
    Chats.remove({ }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})

app.post("/api/deleteAllChat", function (req, res) {


    var dbo = db.db("test");
  dbo.collection("chats").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });



    var mod = new Chats(req.body);
    console.log("id"+JSON.stringify(req.body))
    mod.remove( { }, true );
    // mod.deleteOne({ _id: mod._id }, function (err) {
    //     if (err) {
    //         res.send(err);
    //     }
    //     else {
    //         res.send({ data: "Record has been Deleted" })
    //     }
    // })
})


app.post("/api/removeData", function (req, res) {
    var mod = new Chats(req.body);
    console.log("id ="+JSON.stringify(mod))
//   mod.remove( { } );

Chats.remove({}, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})


app.get("/api/getUser", function (req, res) {
    User.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("User data retrieved successfully")
            res.send(data)

        }
    })
});

app.post("/api/SaveUser", function (req, res) {
    var mod = new User(req.body);
    console.log(mod);
    mod.save(function (err, data) {
        if (err) {
            res.send({ data: "" + err })
        }
        else {
            res.send({ data: "User Data Registerd Successfully" })
        }
    })
})


// app.get("/api/AllMessage", function (req, res) {
//     Chats.find({}, function (err, data) {
//         if (err) {
//             res.send(err)
//         }
//         else {
//             console.log("User data retrieved successfully")
//             res.send(data)

//         }
//     })
// });


// io.on('connection', (socket) => {
//     let userName = socket.handshake.query.userName;
//     addUser(userName, socket.id);

//     socket.broadcast.emit('user-list', [...userList.keys()]);
//     socket.emit('user-list', [...userList.keys()]);

//     socket.on('message', (msg) => {
//         socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
//     })

//     socket.on('disconnect', (reason) => {
//         removeUser(userName, socket.id);
//     })
// });
