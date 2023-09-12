const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { cloudinaryConnect } = require("./config/Cloudinary");
const fileUpload = require("express-fileupload");

//middleware
app.use(express.json());
app.use(cookieParser());

//cloudinary miidleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// router
const userRouter = require("./router/UserRoutes");
const courseRouter = require("./router/courseRouter");
const profileRouter = require("./router/profileRouter");
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", profileRouter);

//database connection
require("./config/Databases").connect();

//cloudinary connection
cloudinaryConnect();

//get
app.get("/", (req, res) => {
  res.send("hi");
});
//app listening
app.listen(process.env.PORT, () => {
  console.log("App is listening ");
});
