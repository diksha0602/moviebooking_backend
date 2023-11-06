const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');

router.get("/test",(req,res)=>{
    res.json({
        message : "This API is working"
    })
})

router.post("/register",async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const euser = await User.findOne({email:email});

        if(euser){
            res.status(409).json("Email already exists");
        }
        else{
            const newUser = new User({
                name,
                password,
                email,
                location,
            });

            await newUser.save();
            res.status(201).json("New user registered successfully");
        }
    }
    catch(err){
        next(err);
    }
});



module.exports = router;    