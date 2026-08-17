const router = require("express").Router();

const upload = require("../middleware/muter2");
const verifytoken = require("../middleware/verifytoken");

const {
  performOne,
  getFinalResult
} = require("../controllers/assessmentcontrollers");


// ======================================================
// PERFORM ONE EXERCISE
// ======================================================

router.post(
  "/perform_one",
  verifytoken,
  upload.array("file"),
  performOne
);


// ======================================================
// GET FINAL ASSESSMENT RESULT
// ======================================================

router.post(
  "/get_final_result",
  verifytoken,
  getFinalResult
);


module.exports = router;