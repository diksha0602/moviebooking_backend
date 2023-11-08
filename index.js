const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
<<<<<<< HEAD
require("dotenv").config();
require("./db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./ROUTES/Auth");
const adminRoutes = require("./ROUTES/Admin");
const movieRoutes = require("./ROUTES/Movie");
const imageuploadRoutes = require("./ROUTES/imageUploadRoutes");

app.use("/auth", authRoutes);
=======
require('dotenv').config();
require("./db")
const cookieParser = require('cookie-parser');
const authRoutes = require('./ROUTES/Auth');
const adminRoutes = require('./ROUTES/Admin');
const movieRoutes = require('./ROUTES/Movie');
const imageuploadRoutes = require('./ROUTES/imageUploadRoutes');
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
>>>>>>> d093f9c9d820575921d4aba9ad10c39179a67243

app.get("/", (req, res) => {
  res.json("The Backend is working");
});

app.use("/admin", adminRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
