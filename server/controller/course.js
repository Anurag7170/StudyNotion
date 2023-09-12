const Course = require("../model/Course");
const User = require("../model/User");
const Category = require("../model/Category");
const { uploadImageToCloudinary } = require("../utils/imageUpload");

exports.createCourse = async (req, res) => {
  try {
    //data fetch
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
    } = req.body;
    // fetch User id
    const Id = req.user.id;

    //fetch image data
    const thumbnail = req.files.thumbnailImage;

    //validation on data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !instructions
    ) {
      return res.json({
        success: true,
        message: "plz fill al the Data",
      });
    }

    // Check if the user is valid
    const instructorDetails = await User.findById(Id);

    //category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //now create the course
    const courseDetail = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      instructions,
      thumbnail: thumbnailImage,
      instructor: instructorDetails._id,
      category: categoryDetails._id,
    });

    //update the user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: courseDetail._id } },
      { new: true }
    );

    // update CAtegory
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: courseDetail._id,
        },
      },
      { new: true }
    );
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: courseDetail,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({});

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const { courseId } = req.body;
    //find course details
    const courseDetails = await Course.find({ _id: courseId });
    //   .populate({
    //     path: "instructor",
    //     populate: {
    //       path: "additionalDetails",
    //     },
    //   })
    //   .populate("category")
    //   //.populate("ratingAndreviews")
    //   .populate({
    //     path: "courseContent",
    //     populate: {
    //       path: "subSection",
    //     },
    //   })
    //   .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
