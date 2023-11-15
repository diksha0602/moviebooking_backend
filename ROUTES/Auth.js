const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.get("/test", (req, res) => {
    res.json({
        message: "This API is working"
    })
})

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.post("/register", async (req, res,next) => {
    try {
        const {name,email,password,bookings,location} = req.body;
        const euser = await User.findOne({email});

        if (euser) {
            res.status(409).json({
                message: "Email already exists"
            });
        }
        else {
                const salt  =  await bcrypt.genSalt(10);
                const hashedpass = await bcrypt.hash(password,salt);
            
                const newUser = new User({
                    name,
                    password:hashedpass,
                    email,
                    location,
                });

                newUser.save();
                res.status(201).json({
                    message:"New User Created"
                })

        }
    }
    catch (err) {
        console.log(err);
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
});


router.get('/checklogin', authTokenHandler, async (req, res) => {
    res.json({
        userId: req.userId,
        ok: true,
        message: 'User authenticated successfully'
    })
})

router.post('/changeCity', authTokenHandler, async (req, res, next) => {
    const { city } = req.body;
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else{
        user.city = city;
        await user.save();
        return res.status(200).json(createResponse(true, 'City changed successfully'));
    }
})

router.get('/logout', authTokenHandler, async (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'User logged out successfully'
    })
})

router.get('/getuser', authTokenHandler, async (req, res) => {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else{
        return res.status(200).json(createResponse(true, 'User found', user));
    }
})

router.post('/changeCity', authTokenHandler, async (req, res, next) => {
    const { location } = req.body;
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else{
        user.location = location;
        await user.save();
        return res.status(200).json(createResponse(true, 'location changed successfully'));
    }
})



module.exports = router;