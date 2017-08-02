var express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser");

//APP INITIALIZATION
app.set("port", (process.env.PORT || 8000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("server/public"));

//INDEX GET ROUTE
app.get("/", function(req, res){
  res.sendFile(path.resolve("server/public/views/index.html"));
});

app.get("/somedata", function(req, res){
  //$ Normally you would send results from database $
  res.sendFile(path.resolve("server/public/scripts/nodes.json"));
});

//LISTENING TO PORT
app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});

//EXPORT MODULE
module.exports = app;
