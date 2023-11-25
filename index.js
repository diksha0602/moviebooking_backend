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
app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000','http://localhost:3001',"https://movie-booking-frontend-ecid.vercel.app/"]; // Add more origins as needed
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials
  })
);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/movie", movieRoutes);
app.use("/image", imageuploadRoutes);

app.get("/", (req, res) => {
  res.json("The Backend is working");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
