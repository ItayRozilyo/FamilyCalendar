require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


const authController = require("./Controllers/AuthController");


app.use("/api/auth", authController);


const calendarController = require("./Controllers/CalendarController");
app.use("/api/calendar", calendarController);

const ip = "127.0.0.1";
const port = process.env.PORT || 5002; 


app.listen(port, ip, () => {
  console.log(`Server Started on http://${ip}:${port}`);
});