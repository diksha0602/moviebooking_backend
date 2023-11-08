const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
require("dotenv").config();
require("./db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./ROUTES/Auth");
const adminRoutes = require("./ROUTES/Admin");
const movieRoutes = require("./ROUTES/Movie");
const imageuploadRoutes = require("./ROUTES/imageUploadRoutes");

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json("The Backend is working");
});

app.use("/admin", adminRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
