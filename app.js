var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    myFunction              = require("./models/user"),
    User                    = myFunction.User,
    Daily                   = myFunction.Daily
    
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
    res.locals.cuurentId 
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
    global.userIn = new Date(Date.now())
    global.username001 = req.user._id

    if(global.userIn.getDay() > 7){
       return res.redirect("/user/" + req.params.id + "/home")
    } else {
        var schema ={
        timeIn:global.userIn,
        }

        Daily.create(schema, function (err, time) {
            if (err) {
                console.log(err)
            } else {
                time.user.id = global.username001
                time.user.username = req.user.username
                time.save()
                global.seq = time._id
                res.redirect("/user/" + req.params.id + "/home")
            }
        })
    }
    
})

app.get("/user/:id/home",function(req,res){
    Daily.find({"user.id":req.user._id},function(err,foundUser){
        if(err){
            console.log(err)
        }else{
            res.render("../views/users",{User:foundUser})
        }
    })
})

app.post("/change", function (req, res) {
    var timedIn = req.body.timedInHours +":" + req.body.timedInSeconds
    var timedOut = req.body.timedOutHours +":" + req.body.timedOutSeconds
    Daily.find({"user.username":"Admin"},function(err,foundUser){
        if(err){
            console.log(err)
        }else{
            foundUser.recTimedIn = timedIn
            foundUser.recTimedOut = timedOut
            console.log("this is the change route" +  foundUser)
            res.redirect("back")
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
                res.redirect("/") 
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
    if(!global.seq){
        req.logout()
        res.redirect("/")
    } else {
        var schema ={
        timeIn:global.userIn,
        timeOut: new Date(Date.now())
        }
        Daily.findOneAndUpdate({"_id":global.seq},schema,function(err,foundDaily){
            if(err){
                console.log(err)
            }else{
                    foundDaily.user.id = req.user._id
                    foundDaily.user.username = req.user.username
                    foundDaily.save()
                    req.logout()
                    res.redirect("/")
            }
        })
    }
})

app.listen(3000,function(){
    console.log("in the beginning")
})