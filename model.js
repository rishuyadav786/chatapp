const mongo= require("mongoose");

var Schema=mongo.Schema;



var Chat=new Schema({
    slo:{type:Number},
    sender_id:{type:String},
    receiver_id:{type:String},
    message:{type:String},
    time:{type:String}

})

var Chats=mongo.model("chats",Chat,"chats")
// module.exports=Users
// module.exports=Items
module.exports = {
 
    Chats
 }