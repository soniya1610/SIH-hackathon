const Assessment = require("../models/assessmentModel");
const axios = require("axios");
const FormData = require("form-data");
const User = require("../models/userModel");
const Media = require("../models/mediaModel");
const cloudinary = require("../utils/cloudinary");


// ======================================================
// PERFORM ONE ASSESSMENT
// ======================================================

exports.performOne = async (req, res) => {
  try {

    const userId = req.user.id;
    const exercise_type = req.body.exercise_type;


    // ------------------------------------------
    // 1. Get user from MySQL
    // ------------------------------------------

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    // MySQL users table has "height"
    const userheight = user.height;

    if (!userheight) {
      return res.status(400).json({
        message: "User height is not available"
      });
    }


    // ------------------------------------------
    // 2. Check uploaded files
    // ------------------------------------------

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded"
      });
    }


    // ------------------------------------------
    // 3. Create FormData
    // ------------------------------------------

    const form = new FormData();


    // Exercise type
    form.append(
      "exercise_type",
      exercise_type
    );


    // ------------------------------------------
    // 4. Get video file
    // ------------------------------------------

    const videoFile = req.files.find(
      file => file.mimetype.startsWith("video/")
    );

    if (videoFile) {

      form.append(
        "video",
        videoFile.buffer,
        videoFile.originalname
      );

    }


    // ------------------------------------------
    // 5. Get reference images
    // ------------------------------------------

    const imageFiles = req.files.filter(
      file => file.mimetype.startsWith("image/")
    );

    imageFiles.forEach(img => {

      form.append(
        "reference_images",
        img.buffer,
        img.originalname
      );

    });


    // ------------------------------------------
    // 6. Add other Flask parameters
    // ------------------------------------------

    form.append(
      "user_height_cm",
      userheight
    );

    form.append(
      "generate_video",
      "true"
    );

    form.append(
      "save_json",
      "true"
    );

    form.append(
      "user_id",
      userId
    );


    // ------------------------------------------
    // 7. Send request to Flask
    // ------------------------------------------

    const response = await axios.post(
      "http://127.0.0.1:5000/analyze_mobile",
      form,
      {
        headers: form.getHeaders()
      }
    );


    // ------------------------------------------
    // 8. Extract Flask response
    // ------------------------------------------

    const {
      generated_video_base64,
      saved_json_content
    } = response.data;


    // Safely get rep_count
    const rep_count =
      saved_json_content?.performance_results?.rep_count || 0;


    // ------------------------------------------
    // 9. Upload generated video to Cloudinary
    // ------------------------------------------

    const videoUploadResult =
      await cloudinary.uploader.upload(

        `data:video/mp4;base64,${generated_video_base64}`,

        {
          folder: "SIH",
          resource_type: "video",
          type: "upload"
        }

      );


    // ------------------------------------------
    // 10. Create Assessment
    // ------------------------------------------

    const savedAssessment =
      await Assessment.create(

        userId,

        exercise_type,

        "verified",

        rep_count

      );


    // ------------------------------------------
    // 11. Create Media parent record
    // ------------------------------------------

    const savedMedia =
      await Media.create(userId);


    // ------------------------------------------
    // 12. Create Media Item
    // ------------------------------------------

    const savedMediaItem =
      await Media.addItem(

        savedMedia.id,

        {
          assessmentId: savedAssessment.id,

          title:
            `Assessment-${exercise_type}-${Date.now()}`,

          type: "video",

          url: videoUploadResult.secure_url,

          publicId: videoUploadResult.public_id
        }

      );


    // ------------------------------------------
    // 13. Send response
    // ------------------------------------------

    return res.status(200).json({

      success: true,

      assessment: savedAssessment,

      media: savedMedia,

      mediaItem: savedMediaItem

    });


  } catch (err) {

    console.error(
      "performOne error:",
      err
    );

    return res.status(500).json({

      message: "Internal server error",

      error: err.message

    });

  }
};



// ======================================================
// GET FINAL RESULT
// ======================================================

exports.getFinalResult = async (req, res) => {

  try {

    const userId = req.user.id;


    // ------------------------------------------
    // 1. Get user from MySQL
    // ------------------------------------------

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }


    // ------------------------------------------
    // 2. Create FormData
    // ------------------------------------------

    const form = new FormData();

    form.append(
      "user_id",
      userId
    );


    // ------------------------------------------
    // 3. Send request to Flask
    // ------------------------------------------

    const flaskresponse =
      await axios.post(

        "http://127.0.0.1:5000/comprehensiveAnalysis",

        form,

        {
          headers: form.getHeaders()
        }

      );


    // ------------------------------------------
    // 4. Return Flask response
    // ------------------------------------------

    return res.status(200).json(
      flaskresponse.data
    );


  } catch (err) {

    console.error(
      "getFinalResult error:",
      err
    );

    return res.status(500).json({

      message: "Internal server error",

      error: err.message

    });

  }

};