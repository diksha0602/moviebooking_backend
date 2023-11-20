const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL
try{
    mongoose.connect(MONGO_URL,{
        dbName : process.env.DB_NAME
    })

    console.log("Connected to Database");
}
catch(err){
    console.log("Not Connected"+err);
}

