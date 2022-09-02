const mongo= require("mongoose");

var Schema=mongo.Schema;

var UsersData=new Schema({
    name:{type:String},
    email:{type:String},
    id:{type:String},
    password:{type:String},
    userType:{type:String},
    isUserVerified:{type:Boolean},
    mobile:{type:String},
    gender:{type:String},
    address:{type:String},
    address2:{type:String},
    city:{type:String},
    state:{type:String},
    zip:{type:String},
    otp:{type:Number},
    randomNumber:{type:Number},
    images:{type:String}
})
 
var ItemsData=mongo.Schema({
    id:{type:String},
    name:{type:String},
    shortDesc:{type:String},
    brand:{type:String},
    color:{type:String},
    displayType:{type:String},
    quanitity:{type:String},
    ram:{type:String},
    price:{type:String},
    rom:{type:String},
    battery:{type:String},
    category:{type:String},
    subCategory:{type:String},
    screenLength:{type:String},
    camera:{type:String},
    wifi:{type:String},
    bluetooth:{type:String},
    warranty:{type:String},
    sensors:{type:String},
    year:{type:Number},
    buyerEmail:{type:String},
    sellerEmail:{type:String},
    images:{type:String},
    processor:{type:String},
    quantity:{type:String},
    size:{type:String},
    image:{data:Buffer, contentType:String}

})
var MyCart=new Schema({
    id:{type:String},
    buyerEmail:{type:String},
    sellerEmail:{type:String},
    productId:{type:String},

})

var MyOrder=new Schema({
    id:{type:String},
    buyerEmail:{type:String},
    sellerEmail:{type:String},
    productId:{type:String},
    quantity:{type:String},
    orderStatus:{type:String},
    paymentType:{type:String},
    paymentStatus:{type:String},
    productOrderDate:{type:Date},
    deliveredDate:{type:Date}
})
var AllReviews=new Schema({
    id:{type:String},
    buyerEmail:{type:String},
    sellerEmail:{type:String},
    productId:{type:String},
    comments:{type:String},
    ratings:{type:Number},
    name:{type:String},
    images:{type:String},
})

var Chat=new Schema({
    slo:{type:Number},
    sender_id:{type:String},
    receiver_id:{type:String},
    message:{type:String},
    time:{type:String}

})
// var model= mongo.model("users",UsersSchema,"users");  data:Buffer, contentType:String
var Users=mongo.model("usersdata",UsersData,"usersdata")
var Items=mongo.model("Items",ItemsData,"postdata")
var myCarts=mongo.model("myCart",MyCart,"myCart")
var myOrders=mongo.model("myOrders",MyOrder,"myOrders")
var allReviews=mongo.model("AllReviews",AllReviews,"AllReviews")
var Chats=mongo.model("chats",Chat,"chats")
// module.exports=Users
// module.exports=Items
module.exports = {
    Users,
    Items,
    myCarts,
    myOrders,
    allReviews,
    Chats
 }