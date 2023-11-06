const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
    ,
    email:{
        type:String,
        required:true
    }
    ,
    password:{
        type:String,
        required:true,
        unique:true
    }
    ,
    bookings:{
        type: Array,
        default: []
    }
    ,
    location:{
        type: String,
        required: true,
    }
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema);
module.exports=User;
