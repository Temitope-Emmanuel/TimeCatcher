var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
});

var timelySchema = new mongoose.Schema({
    recTimedIn:String,
    recTimedOut:String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})
var Timely = mongoose.model("Timely",timelySchema)

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User",userSchema);

var dailySchema = new mongoose.Schema({
    timeIn:Number,
    timeOut:Number,
    user:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
})

var Daily = mongoose.model("Daily",dailySchema)



module.exports = {
    Daily,
    User,
    Timely
}