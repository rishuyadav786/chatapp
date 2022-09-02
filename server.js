// Require express and create an instance of it
var express = require('express');
var app = express();


const http = require("http");


// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write('Hello World!');
//   res.end();
// }).listen(process.env.PORT || 3000);




const host = 'localhost';
const port = process.env.PORT || 3000;

// const requestListener = function (req, res) {};

const requestListener = function (req, res) {
    res.setHeader("Content-Type", 'text/html');
    res.writeHead(200);
    res.end(`{"message": "This is a JSON response"}`);
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


// const books = JSON.stringify([
//     { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
//     { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
// ]);

// const authors = JSON.stringify([
//     { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
//     { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 }
// ]);

// const requestListener = function (req, res) {
//     res.setHeader("Content-Type", "application/json");
//     switch (req.url) {
//         case "/books":
//             res.writeHead(200);
//             // res.end(books);
//             res.end(`{"message": "This is a books"}`);
//             break
//         case "/authors":
//             res.writeHead(200);
//             // res.end(authors);
//             res.end(`{"message": "This is a author"}`);
//             break
//         default:
//             res.writeHead(404);
//             res.end(JSON.stringify({error:"Resource not found Rishu"}));
//     }
// }





// on the request to root (localhost:3000/)
// app.get('/', function (req, res) {
//     res.send('<b>My</b> first express http server');
// });

// // On localhost:3000/welcome
// app.get('/welcome', function (req, res) {
//     res.send('<b>Hello</b> welcome to my http server made with express');
// });

// // Change the 404 message modifing the middleware
// app.use(function(req, res, next) {
//     res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
// });

// start the server in the port 3000 !
// app.listen(process.env.PORT || 3000, function () {
//     console.log('Example app listening on port 3000.');
// });









