const express = require("express");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));


var count = 1;
var dutyIncIndex = 1;

function check() {
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    console.log(hr, min, sec);
    console.log("Being Called");
    if (hr === 23 && min === 59 && sec === 59) {
        count = count + 1;
        console.log("count from " + count);
        console.log("Count " + count);
        dutyIncIndex = count % 3;
        console.log("true");
    }
}

setInterval(check, 1000)
app.get("/", function (req, res) {
    res.render("home", {
        data: dutyIncIndex
    })
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started on port 3000");
});