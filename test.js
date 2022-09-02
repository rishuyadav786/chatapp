const express = require("express")();
const cors = require("cors");
const http = require("http").createServer(express);
// const io = require("socket.io")(http);
const { MongoClient } = require("mongodb");
const mongo = require("mongoose");
const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';
// const client = new MongoClient(process.env['mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority']);
var myModule = require('./model2.js');
const Chats = myModule.Chats;
express.use(cors());

var collection;
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
var db = mongo.connect(mongoPath, function (err, response) {
    if (err) {
        console.log("connection faild...." + err)
    }
    else {
        console.log("connected to" + db, "+", response);
    }
})

http.listen(8000, async () => {
    try {
        // await client.connect();
        // collection = client.db("chatmaster").collection("chats");
        console.log("Listening on port :%s...", http.address().port);
    } catch (e) {
        console.error(e);
    }
});


express.get("/api/AllMessage", async (request, response) => {
    try {
        // Chats.find({}, function (err, data) {
            // let result = await collection.findOne({ "_id": request.query.room });
        let result = await Chats.find({  });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
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



express.post("/api/deleteAllChat", function (req, res) {
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

express.post("/api/deleteAllChat", function (req, res) {


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


express.post("/api/removeData", function (req, res) {
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


express.get("/api/AllMessage", function (req, res) {
    Chats.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("User data retrieved successfully")
            res.send(data)

        }
    })
});


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
