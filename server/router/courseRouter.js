const express = require("express");
const router = express.Router();

//middleware
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");

//course
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controller/course");

//route for course
router.post("/createCourse",auth, isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetails",getCourseDetails);


//category
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controller/category");

//route for category
router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", auth, isAdmin, showAllCategories);
router.post("/categoryPageDetails", auth, isAdmin, categoryPageDetails);

module.exports = router;
