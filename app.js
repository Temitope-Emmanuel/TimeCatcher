var express = require("express"),
    app     = express(),
    mongoose = require("mongoose")


mongoose.connect("mongodb://127.0.0.1/time", { useNewUrlParser: true });
app.set("view engine","ejs")

// LANDING PAGE
app.get("/",function(req,res){
    res.redirect("/register")
})

app.get("/register",function(req,res){
    res.render("../views/register")
})

app.listen(3000,function(){
    console.log("in the beginning")
})