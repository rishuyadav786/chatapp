const mongo= require("mongoose");

var Schema=mongo.Schema;

var Chat=new Schema({
    slo:{type:Number},
    sender_id:{type:String},
    receiver_id:{type:String},
    message:{type:String},
    time:{type:String}

})
var User=new Schema({
    slo:{type:Number},
    name:{type:String},
    email:{type:String},
    password:{type:String},
    active:{type:Boolean},

})

// var model= mongo.model("users",UsersSchema,"users");  data:Buffer, contentType:String

var Chats=mongo.model("chats",Chat,"chats")
var Users=mongo.model("users",User,"users")

// module.exports=Users
// module.exports=Items
module.exports = {
    Chats,
  
    Users
   
 }