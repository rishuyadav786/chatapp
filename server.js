// // Require express and create an instance of it
// var express = require('express');
// const mongo = require("mongoose");
// var myModule = require('./model2.js');
// const Chats = myModule.Chats;
// var app = express();
// const http = require("http");
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// // mongo.set('useNewUrlParser', true);
// // mongo.set('useFindAndModify', false);
// // mongo.set('useCreateIndex', true);
// // mongo.set('useUnifiedTopology', true);
// // const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';

// const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// var db = mongo.connect(mongoPath, function (err, response) {
//     if (err) {
//         console.log("connection faild...." + err)
//     }
//     else {
//         console.log("connected to" + db, "+", response);
//     }
// })



// // MongoClient.connect(mongoPath, function(err, db) {
// //   if (err) throw err;
// //   var dbo = db.db("chatmaster");
// //   dbo.createCollection("customers", function(err, res) {
// //     if (err) throw err;
// //     console.log("Collection created!");
// //     db.close();
// //   });
// // });




// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});

//   switch (req.url) {
//             case "/books":
//                 res.writeHead(200);
//                 Chats.find({}).toArray(function(err, result) {
//                     if (err) throw err;
//                     var query = result;
//                     db.close();
//                     res.write(query);
//                     res.end();
//                 });
//                 //     res.write(query);
//                 //  res.end();
//                 // res.end(getMessage());
//                 // res.end(`{"message": "This is a books"}`);
//                 break
//             case "/authors":
//                 res.writeHead(200);
//                 // res.end(authors);
//                 res.end(`{"message": "This is a author"}`);
//                 break
//             default:
//                 res.writeHead(404);
//                 res.end(JSON.stringify({error:"Resource not found Rishu"}));
//         }

// //   res.write('Hello World!'+req.url);
// //   res.end();
// }).listen(process.env.PORT || 3000);


// function getMessage() {
    
// //    return  Chats.find();
  
// }

// // const host = 'localhost';
// // const port = process.env.PORT || 3000;

// // const requestListener = function (req, res) {};

// // const requestListener = function (req, res) {
// //     res.setHeader("Content-Type", 'text/html');
// //     res.writeHead(200);
// //     res.end(`{"message": "This is a JSON response"}`);
// // };

// // const server = http.createServer(requestListener);

// // server.listen(port, host, () => {
// //     console.log(`Server is running on http://${host}:${port}`);
// // });


// // const books = JSON.stringify([
// //     { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
// //     { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
// // ]);

// // const authors = JSON.stringify([
// //     { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
// //     { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 }
// // ]);

// // const requestListener = function (req, res) {
// //     res.setHeader("Content-Type", "application/json");
// //     switch (req.url) {
// //         case "/books":
// //             res.writeHead(200);
// //             // res.end(books);
// //             res.end(`{"message": "This is a books"}`);
// //             break
// //         case "/authors":
// //             res.writeHead(200);
// //             // res.end(authors);
// //             res.end(`{"message": "This is a author"}`);
// //             break
// //         default:
// //             res.writeHead(404);
// //             res.end(JSON.stringify({error:"Resource not found Rishu"}));
// //     }
// // }





// // on the request to root (localhost:3000/)
// // app.get('/', function (req, res) {
// //     res.send('<b>My</b> first express http server');
// // });

// // // On localhost:3000/welcome
// // app.get('/welcome', function (req, res) {
// //     res.send('<b>Hello</b> welcome to my http server made with express');
// // });

// // // Change the 404 message modifing the middleware
// // app.use(function(req, res, next) {
// //     res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
// // });

// // start the server in the port 3000 !
// // app.listen(process.env.PORT || 3000, function () {
// //     console.log('Example app listening on port 3000.');
// // });







// Require express and create an instance of it




// -----------------------------------------------------------------------

// var express = require('express');
// var app = express();


// const http = require("http");


// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});

//   switch (req.url) {
//             case "/books":
//                 res.writeHead(200);
//                 // res.end(books);
//                 res.end(`{"message": "This is a books"}`);
//                 break
//             case "/authors":
//                 res.writeHead(200);
//                 // res.end(authors);
//                 res.end(`{"message": "This is a author"}`);
//                 break
//             default:
//                 res.writeHead(404);
//                 res.end(JSON.stringify({error:"Resource not found Rishu"}));
//         }

// //   res.write('Hello World!'+req.url);
// //   res.end();
// }).listen(process.env.PORT || 3000);



// -------------------------------------------------------------------------------------


var express = require('express');
var app = express();


var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/MYDB";
const mongo = require("mongoose");
var myModule = require('./model2.js');
const Chats = myModule.Chats;

const mongoPath = "mongodb+srv://fdplazaa:Rishu12345@cluster0.48xj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"




http.createServer(function (req, res) {
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
    case "/books":
        res.writeHead(200);
        // res.end(books);
        res.end(`{"message": "This is a books"}`);
        break
    case "/authors":
        res.writeHead(200);
        // res.end(authors);
        res.end(`{"message": "This is a author"}`);
        break
    default:
        // res.writeHead(404);
        // res.end(JSON.stringify({error:"Resource not found Rishu"}));
        
Chats.find({},function(err, result) {
    if (err) throw err;
    console.log(result);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!'+JSON.stringify(result));
    res.end();
})
}
  
}).listen(process.env.PORT || 3000);
