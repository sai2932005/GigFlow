const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const userRoutes = require("./routes/userRoutes")

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/jobs/",jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/users",userRoutes)


mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("Connected to  Mongodb"))
    .catch((error)=> console.log("MongoDb connection error",error))
const PORT = process.env.PORT || 5000 ;
app.listen(PORT , ()=>{
    console.log("server running on port",PORT)
})