
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
const nodemailer = require("nodemailer");//for email send...
const path =require("path")
const mongo = require("mongoose");
var port=process.env.PORT||8000;
var myModule = require('./model.js');
// const User = myModule.Users;
// const Item = myModule.Items;
// const myCart=myModule.myCarts;
// const myOrder=myModule.myOrders;
// const allReview=myModule.allReviews;
const Chats = myModule.Chats;


const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});


app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';

// const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';



var db = mongo.connect(mongoPath, function (err, response) {
    if (err) {
        console.log("connection faild...."+err)
    }
    else {
        console.log("connected to" + db, "+", response);
    }
})



// app.listen(port, () => {
//     console.log("The server started on port"+ port+ "!!!!!!");
// });



// const uri = 'mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// mongo.connect(uri,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true}
//     );
// const connection = mongo.connection;
// connection.once('open',() =>{
// console.log("mongoDB database connection established successfully"+uri);
// })



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
        //socket.emit('message-broadcast', {message: msg, userName: userName});
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




app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});




const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../../Angular/FoodPlaza/src/assets/')
    },
    filename: (req, file, callBack) => {
        // callBack(null, `FoodPlaza_${file.originalname}`)//for using name before image name
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })





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


app.get("/api/AllMessage", function (req, res) {
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


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }



app.use(express.static('./dist/FoodPlaza'));

app.get('/*', (req, res) =>{

    console.log(`rishu server is running on port ${port}`);
    res.sendFile('index.html', {root: 'dist/FoodPlaza/'})
}
);

app.get("/api/display", (req, res) => {
    res.sendFile(path.join(__dirname+"/display.html")
    );
});

app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})

app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({ sttus: 'ok' });
})



// --------------------------------
app.get("/sendmail1", (req, res) => {
    res.send(
        `<h1 style='text-align: center'>
            Wellcome to FunOfHeuristic 
            <br><br>
            <b style="font-size: 182px;">😃👻</b>
        </h1>`
    );
});
// define a sendmail endpoint, which will send emails and response with the corresponding status


app.post("/api/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    console.log(user);

    sendMail(user, (err, info) => {
        if (err) {
            console.log(err);
            res.status(400);
            res.send({ error: "Failed to send email" });
        } else {
            console.log("Email has been sent");
            res.send(info);
        }
    });
});



const sendMail = (user, callback) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'rkvirus2@gmail.com',
            pass: 'Rishu@12345'
        }
    });

    var mailOptions = {
        from: 'rkvirus2@gmail.com',
        to: `${user.email}`,
        subject: 'Verify FoodPlaza Account',
        text: `Hi, thank you for regestring in FoodPlaza. Please verify your otp . your otp is = ${user.randomNumber}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


