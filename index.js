const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/Auth');
const adminRoutes = require('./Routes/Admin');
const movieRoutes = require('./Routes/Movie');
const imageuploadRoutes = require('./Routes/imageUploadRoutes');



app.get("/",(req,res)=>{
    res.json("The Backend is working");
})

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})
