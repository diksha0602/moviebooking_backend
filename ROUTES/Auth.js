const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.get("/test", (req, res) => {
    res.json({
        message: "This API is working"
    })
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const euser = await User.findOne({ email: email });

        if (euser) {
            res.status(409).json({
                message: "Email already exists"
            });
        }
        else {
            bcrypt.hash(req.body.password, 8, function (err, hash) {
                const newUser = new User({
                    name,
                    password:hash,
                    email,
                    location,
                });
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(201).json({
                            message: "New User created Successfully"
                        });
                    }
                });
            })

        }
    }
    catch (err) {
        next(err);
    }

})

router.post('/login', async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log('user not found');
        return res.status(400).json({
            message:"invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('password not matched');
        return res.status(400).json({
            message:"invalid"
        });
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '30m' });
    res.cookie('authToken', authToken,  { httpOnly: true, secure: true, sameSite: 'None' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' });

    res.status(200).json({
        message:"Login Successful",
        authToken,
        refreshToken
    })
})



module.exports = router;