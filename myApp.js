var express = require('express');
var bodyParser = require('body-parser'); // for parsing body of POST requests
var app = express();
console.log("Hello World");

// add static resources for requests to "/public"
app.use("/public", express.static( __dirname + "/public"));

// add middleware to handle urlencoded data
// it creates a req.body object containing the query params as json
// with 'extended=false', body-parser uses the classic encoding querystring library. 
app.use(bodyParser.urlencoded({extended: false}));

// add root level logger
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});
// chain middleware function and final handler
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({"time": req.time});
});

// serve string
// app.get("/", function(req, res) {res.send("Hello Express")});

// serve HTML page
app.get("/", function(req, res) {res.sendFile(__dirname + "/views/index.html")});

// serve JSON
app.get("/json", function(req, res) {
  let jsonMessageString = "Hello json";
  let jsonReturnString = process.env.MESSAGE_STYLE === "uppercase" ? jsonMessageString.toUpperCase() : jsonMessageString;
  res.json({"message": jsonReturnString})
});

// "echo server"
app.get("/:word/echo", function(req, res) {
  res.json({"echo": req.params.word});
});

// using query parameters from GET request
app.get("/name", function(req, res) {
  res.json({'name': req.query.first + ' ' + req.query.last});
});

// using query parameters from POST request
// req.body is created by body-parser middleware
app.post("/name", function(req, res) {
  res.json({'name': req.body.first + ' ' + req.body.last});
});

// a shorter way to combine above routing information would be:
// app.route("/name").get(<handler for GET>).post(<handler for POST>);

 module.exports = app;
