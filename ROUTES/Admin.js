const express = require("express");
const router = express.Router();
const Admin = require("../Models/AdminSchema");
const adminTokenHandler = require("../Middleware/checkAdmin");
const errorHandler = require("../Middleware/errorMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.get("/test", async (req, res) => {
  res.json({
    message: "Admin api is working",
  });
});

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin) {
      return res
        .status(409)
        .json(createResponse(false, "Email already exists"));
    }

    //not an existing user so passing in the user schema
    const newAdmin = new Admin({
      name,
      password,
      email,
    });

    await newAdmin.save(); //await the save operation
    res.status(201).json(createResponse(true, "Admin registered successfully"));
  } catch (err) {
    next(err);
  }
});
// router.post("/sendotp", async (req, res) => {});
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json(createResponse(false, "Invalid Credentials"));
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json(createResponse(false, "Invalid Credentials"));
  }
  const adminToken = jwt.sign(
    { adminId: admin._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign(
    { adminId: admin._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "30m" }
  );

  res.cookie("adminToken", adminToken, { httpOnly: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true });

  res.status(200).json(
    createResponse(true, "Login Successfull", {
      adminToken,
      refreshToken,
    })
  );
});

router.use(errorHandler);
module.exports = router;
