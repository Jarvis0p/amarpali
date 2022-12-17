var http = require('http'),
    https = require('https'),
    express = require('express')
    fs = require('fs');

var domain = 'amarpali.me';



const ejs = require("ejs");

var app = express();

app.get('*', function(req, res){
    // redirect to HTTPS
    res.redirect('https://' + domain + req.path);
});

http.createServer(app).listen(80, function(){
    console.log('HTTP listening on port 80');
});

var appSecure = express();
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
        console.log("count from " + count);
        console.log("Count " + count);
        dutyIncIndex = count % 3;
        console.log("true");
    }
}

setInterval(check, 1000)
appSecure.get("/", function (req, res) {
    res.render("home", {
        data: dutyIncIndex
    })
});

// app.listen(process.env.PORT || 3000, function () {
//     console.log("Server Started on port 3000");
// });




var options = {
  key: fs.readFileSync('amarpali_me.pem'),
  cert: fs.readFileSync('amarpali_me.crt'),
};

https.createServer(options, appSecure).listen(443, function(){
    console.log('HTTPS listening on port 443');
});
