var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    myFunction              = require("./models/user"),
    User                    = myFunction.User,
    Daily                    = myFunction.Daily
    
mongoose.connect("mongodb://127.0.0.1/time", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs")

// PASSPORT CONFIG 
app.use(require("express-session")({
    secret:"first tryout",
    resave:false,
    saveUninitialized:false
}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

// LANDING PAGE
app.get("/",function(req,res){
    res.redirect("/home")
})

app.get("/home",function(req,res){
    res.render("../views/landing")
})

app.get("/user/:id",function(req,res){
    var schema ={
        time:Date.now(),
    }
   User.findById(req.params.id,function(err,user){
       if(err){
           console.log(err)
       }else{
           Daily.create(schema,function(err,time){
               if(err){
                   console.log(err)
               }else{
                    time.user.id = req.user._id
                    time.user.username = req.user.username
                    time.save()
                    console.log(time)
                    res.render("../views/users",{time:time})
               }
           })
       }
   })
})

app.get("/register",function(req,res){
    res.render("../views/register")
})

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/register") 
            })
        }
    })
})

app.get("/login",function(req,res){
    res.render("../views/login")
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/home",
    failureRedirect:"/register"
}),function(req,res){
})
app.get("/logout",function(req,res){
    req.logout()
    res.redirect("/home")
})

app.listen(3000,function(){
    console.log("in the beginning")
})