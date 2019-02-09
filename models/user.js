var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var dateSchema = new mongoose.Schema({
    time:String
})

var Date = mongoose.model("Date",dateSchema)

var userSchema = new mongoose.Schema({
    username:String,
    password:String,
    time:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Date"
        },
        date:"String"
    }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User",userSchema);

module.exports = {
    Date,
    User
}