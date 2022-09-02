
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
const nodemailer = require("nodemailer");//for email send...
// var email  = require('emailjs/email');//for email send 2....
// var MongoStore=require('connect-mongo')(session)
const path =require("path")
const mongo = require("mongoose");
var port=process.env.PORT||8000;
var myModule = require('./model.js');
const User = myModule.Users;
const Item = myModule.Items;
const myCart=myModule.myCarts;
const myOrder=myModule.myOrders;
const allReview=myModule.allReviews;
const Chats = myModule.Chats;
// var User = require('./models');

// mongo.set('useNewUrlParser', true);
// mongo.set('useFindAndModify', false);
// mongo.set('useCreateIndex', true);
// mongo.set('useUnifiedTopology', true);
// var url = "mongodb+srv://fdplaza:<password>@foodplaza.outf5.mongodb.net/<dbname>?retryWrites=true&w=majority"
// const mongoPath = "mongodb+srv://fdplaza:Rishu12345@foodplaza.outf5.mongodb.net/FoodPlaza?retryWrites=true&w=majority"
// const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';
// const mongoPath="mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/test"
// var db = mongo.connect("mongodb://127.0.0.1:27017/Olxdb", function (err, response) {node


var db = mongo.connect(mongoPath, function (err, response) {
    if (err) {
        console.log("connection faild...."+err)
    }
    else {
        console.log("connected to" + db, "+", response);
    }
})

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

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

//let upload = multer({ dest: 'uploads/' })


var Schema = mongo.Schema;


var UsersData = new Schema({
    name: { type: String },
    email: { type: String },
    id: { type: String },
    password: { type: String },
    userType: { type: String },
    isUserVerified: { type: Boolean }
})

var PostData = mongo.Schema({
    user: { type: String },
    postName: { type: String },
    postPrice: { type: Number },
    postDes: { type: String },
    email: { type: String },
    category: { type: String },
    image: { data: Buffer, contentType: String }

})

// var model= mongo.model("users",UsersSchema,"users");  data:Buffer, contentType:String
// var model=mongo.model("usersdata",UsersData,"usersdata")
var model2 = mongo.model("postdata", PostData, "postdata")

// saving users registered data

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

// saving Posted data
app.get("/api/getUserById/:email", function (req, res) {
    console.log("req body= "+req.params.email)
    User.findOne({email: req.params.email}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("User data retrieved successfully")
            res.send(data)

        }
    })
});

app.post("/api/UpdateUserVerification", function (req, res) {
    var mod = new User(req.body);
    console.log("data for update" + JSON.stringify(mod));
    User.findByIdAndUpdate(req.body._id, { isUserVerified: true},
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });

})

app.post("/api/UpdateUserData", function (req, res) {
    var mod = new User(req.body);
    console.log("data for update" + JSON.stringify(mod));
    User.findByIdAndUpdate(req.body._id, {name:req.body.name,gender:req.body.gender,email:req.body.email, mobile: req.body.mobile, address: req.body.address, address2: req.body.address2, city: req.body.city , state:req.body.state, zip:req.body.zip,images:req.body.images},
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });

})
app.post("/api/postData", function (req, res) {
    var mod = new Item(req.body);
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
app.post("/api/addToCart", function (req, res) {
    var mod = new myCart(req.body);
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
app.post("/api/placeOrders", function (req, res) {
    var mod = new myOrder(req.body);
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
app.post("/api/addReviews", function (req, res) {
    var mod = new allReview(req.body);
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

app.post("/api/updateReviews", function (req, res) {
    var mod = new allReview(req.body);
    console.log("data for update" + JSON.stringify(mod));
    allReview.findByIdAndUpdate(req.body._id, { ratings:req.body.ratings,comments:req.body.comments,images:req.body.images},
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });

})

app.post("/api/updateOrderStatus", function (req, res) {
    var mod = new myOrder(req.body);
    console.log("data for update" + JSON.stringify(mod));
    myOrder.findByIdAndUpdate(req.body._id, { orderStatus:req.body.orderStatus},
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });

})


// app.post("/api/updateReviews", function (req, res) {
//     var mod = new allReview(req.body);
//     console.log(mod);
//     mod.save(function (err, data) {
//         if (err) {
//             res.send({ data: "" + err })
//         }
//         else {
//             res.send({ data: "User Data Registerd Successfully" })
//         }
//     })
// })



app.post("/api/postData1", upload.single('image'), (req, res) => {
    var pod = new Item(req.body, req.file)
    if (req.body.mode == "Save") {
        pod.save((err, data) => {
            if (err) {
                res.send({ data: "" + err })
            }
            else {
                res.send({ data: "Post saved successfully" })

            }
        })
    }
    else {
        model2.findByIdAndUpdate(req.body.id, { postName: req.body.postName, postPrice: req.body.postPrice, postDes: req.body.postDes, category: req.body.category },
            function (err, data) {
                if (err) {
                    res.send(err)
                }
                else {
                    res.send({ data: "recorde ha supdated" })
                }
            }
        )

    }

})

//Retrieving users registerd data from database 

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

// app.get("/api/getUserById/:email", function (req, res) {
//     console.log("req body= "+req.params.email)
//     Users.findOne({email: req.params.email}, function (err, data) {
//         if (err) {
//             res.send(err)
//         }
//         else {
//             console.log("User data retrieved successfully")
//             res.send(data)

//         }
//     })
// });
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

app.get("/api/getAllItemsById/:email", function (req, res) {
    console.log("req body= "+req.params.email)
    let seachText=req.params.email;
  

    Item.find(   {
        $or: [
            {name: { $regex: escapeRegExp(seachText) }},
            {category:  { $regex:escapeRegExp(seachText)  }},
            {subCategory:  { $regex:escapeRegExp(seachText)  }},
            {brand:  { $regex:escapeRegExp(seachText)  }},
            {sellerEmail:  { $regex:seachText  }},
           
        ]
    }, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("User data retrieved successfully")
            res.send(data)

        }
    })
});



app.get("/api/getItemById/:id", function (req, res) {
    console.log("req body= "+req.params.id)
    let seachText=req.params.email;
  

    Item.findOne(   {_id:req.params.id }, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("User data retrieved successfully")
            res.send(data)

        }
    })
});

// router.route('/:league_id')
//      .get(function(req,res){
//          League.findOne({id: req.params.league_id})
//      .exec(function(err,docs){
//          if(err)
//          res.send(err);
//      res.json(docs);
//   })});


app.get("/api/getItems", function (req, res) {
    Item.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Items data retrieved successfully")
            res.send(data)

        }
    })
});

app.get("/api/getMyItems", function (req, res) {
    myCart.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Items data retrieved successfully")
            res.send(data)

        }
    })
});
app.get("/api/getMyOrders", function (req, res) {
    myOrder.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Items data retrieved successfully")
            res.send(data)

        }
    })
});
app.get("/api/getAllOrders", function (req, res) {
    myOrder.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Items data retrieved successfully")
            res.send(data)

        }
    })
});

app.get("/api/getAllReviews", function (req, res) {
    allReview.find({}, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Items data retrieved successfully")
            res.send(data)

        }
    })
});

//Retrieving users posted data from database 

app.get("/api/getPosts", function (req, res) {
    model2.find({}, (err, data) => {
        if (err) {
            res.send(err)
        }
        else {
            console.log("Posts retrieved successfully")
            res.send(data)
        }
    })
})


app.post("/api/deletePost", function (req, res) {
    model2.remove({ _id: req.body.id }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})

app.post("/api/cancelOrder", function (req, res) {
    var mod = new myOrder(req.body);
    console.log("id"+JSON.stringify(req.body))
    myOrder.deleteOne({ _id: req.body.orderId }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})

app.post("/api/removeProductFromCart", function (req, res) {
    var mod = new myCart(req.body);
    console.log("id"+JSON.stringify(req.body))
    mod.deleteOne({ _id: mod._id }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})
app.post("/api/deleteProductFromMyList", function (req, res) {
    var mod = new Item(req.body);
    console.log("id"+JSON.stringify(req.body))
    mod.deleteOne({ _id: mod._id }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})

// app.get("/api/getdescription",function(req,res){
//     console.log("BOdy "+req.body)
//     console.log("Id "+req.body.id)
//     model2.findOne({_id:req.body.id},function(err,data){
//         if(err){
//             res.send({data:"error is "+err});
//         }
//         else{
//             res.send({data:"Id is retrieved"})
//         }
//     })
// })

// app.get("/", (req, res) => {
//     res.send(
//         `<h1 style='text-align: center'>
//             Welcome to FoodPlaza
//             <br><br>
//             <b style="font-size: 182px;">😃👻</b>
//         </h1>`
//     );
// });
// app.use(express.static(__dirname + "foodplaza")); //
// app.get("/", (req, res) => {
//     console.log(path.resolve(__dirname+"/src/index.html"))
//   res.sendFile(path.resolve(__dirname+"/src/index.html"));
// });
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname+"/dist/foodplaza/index.html")
   
//     );
// });

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



// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//   user: 'rishuyadav204@gmail.com',
//   pass: '80133493'
//   }
//   });

//   var mailOptions = {
//   from: 'rishuyadav204@gmail.com',
//   to: 'yadavrishu98@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: `Hi, thank you for your nice Node.js Email.`
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//   console.log(error);
//   } else {
//   console.log('Email sent: ' + info.response);
//   }
//   });