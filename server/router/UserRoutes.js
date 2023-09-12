const express= require("express");
const router = express.Router();

const {sendOtp , signup,login,changePassword} = require("../controller/userAuth");
const {auth} = require("../middlewares/auth");

//need to work
// router.post("/auth",auth);
router.post("/changepassword",auth, changePassword);





router.post("/sendotp",sendOtp);
router.post("/signup",signup);
router.post("/login", login);

module.exports = router;