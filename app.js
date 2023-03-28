var http = require('http');
var https = require('https');
var express = require('express');
var fs = require('fs');
var path = require('path');
var morgan = require('morgan');
const domain = 'amarpali.me';

// create "middleware"
//var logger = morgan('combined')

const ejs = require("ejs");
var accessLogStream_http = fs.createWriteStream(path.join(__dirname + '/logs/' + 'access_http.log'), { flags: 'a' })

var app = express();
app.use(morgan('combined', { stream: accessLogStream_http}));
//app.use(logger('dev'));

app.get('*', function(req, res){
    // redirect to HTTPS
	
    res.redirect('https://' + domain + req.path);
});

http.createServer(app).listen(80, function(){
    console.log('HTTP listening on port 80');
});


var appSecure = express();
var accessLogStream_https = fs.createWriteStream(path.join(__dirname + '/logs/' + 'access_https.log'), { flags: 'a' })

// create a write stream (in append mode)
appSecure.use(morgan('combined', { stream: accessLogStream_https }));

//appSecure.use(logger('dev'));
// configure your app here


appSecure.set('view engine', 'ejs');
appSecure.use(express.static("public"));


var count = 1;
var dutyIncIndex = 1;

function check() {
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    if (hr === 23 && min === 59 && sec === 59) {
        count = count + 1;
        //console.log("count from " + count);
        //console.log("Count " + count);
        dutyIncIndex = count % 3;
        //console.log("true");
    }
}

setInterval(check, 1000)
appSecure.get("/", function (req, res) {
    res.render("home", {
        data: dutyIncIndex
    })
});

appSecure.get("/robots.txt", function (req,res){
	res.sendFile(__dirname + "/robots.txt");
});

appSecure.get("/sitemap.xml", function(req,res){
	res.sendFile(__dirname + "/sitemap.xml");
});


// app.listen(process.env.PORT || 3000, function () {
//     console.log("Server Started on port 3000");
// });




var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('amarpali_me.crt'),
};

https.createServer(options, appSecure).listen(443, function(){
    console.log('HTTPS listening on port 443');
});
