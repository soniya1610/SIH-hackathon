const phonevalidate = require('../utils/validatephonenumber');
const verifyotp = require('../utils/verifyotp');
const sendotp = require('../utils/sendotp');
const User = require('../models/userModel');
const generateJWT = require('../utils/generatejwt');


// =========================
// SIGNUP - SEND OTP
// =========================
exports.signup_sendotp = async (req, res) => {
    try {
        const phone = req.body.phone;

        // Validate phone number
        const isvalid = phonevalidate(phone);

        if (isvalid.error) {
            return res.status(400).send({
                message: isvalid.error.details[0].message
            });
        }

        // Check if user already exists
        const exists = await User.findByPhone(phone);

        if (exists) {
            return res.status(400).send({
                message: "User already exists"
            });
        }

        // Send OTP
        await sendotp(phone);

        return res.status(200).send({
            message: "OTP sent successfully"
        });

    }  catch (error) {
    console.error("Signup send-otp error:", error);

    return res.status(500).send({
        message: "Internal server error",
        error: error.message
    });
}
};


// =========================
// SIGNUP - VERIFY OTP
// =========================
exports.signup_verifyotp = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = req.body.otp;

        // Verify OTP
        const VerifyResult = await verifyotp(phone, otp);

        if (VerifyResult.status === 'approved') {

            // Create user in MySQL
            const newuser = await User.create(phone);

            // Mark phone as verified
            const user = await User.verifyPhone(phone);

            // Generate JWT
            const token = generateJWT(user);

            return res.status(200).send({
                message: "User verified and created successfully",
                token: token,
                redirectUrl: "http://localhost:5173"
            });
        }

        // Invalid OTP
        return res.status(400).send({
            message: "Invalid OTP"
        });

    } catch (error) {
        console.error("Signup verify-otp error:", error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};


// =========================
// LOGIN - SEND OTP
// =========================
exports.login_sendotp = async (req, res) => {
    try {
        const phone = req.body.phone;

        // Validate phone number
        const isvalid = phonevalidate(phone);

        if (isvalid.error) {
            return res.status(400).send({
                message: isvalid.error.details[0].message
            });
        }

        // Check if user exists
        const user = await User.findByPhone(phone);

        if (!user) {
            return res.status(400).send({
                message: "User does not exist, please signup first"
            });
        }

        // Send OTP
        await sendotp(phone);

        return res.status(200).send({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Login send-otp error:", error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};


// =========================
// LOGIN - VERIFY OTP
// =========================
exports.login_verifyotp = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otp = req.body.otp;

        // Verify OTP
        const VerifyResult = await verifyotp(phone, otp);

        if (VerifyResult.status === 'approved') {

            // Get user from MySQL
            const user = await User.findByPhone(phone);

            if (!user) {
                return res.status(404).send({
                    message: "User not found"
                });
            }

            // Mark phone as verified
            const verifiedUser = await User.verifyPhone(phone);

            // Generate JWT
            const token = generateJWT(verifiedUser);

            return res.status(200).send({
                message: "User verified and logged in successfully",
                token: token,
                redirectUrl: "http://localhost:5173"
            });
        }

        return res.status(400).send({
            message: "Invalid OTP"
        });

    } catch (error) {
        console.error("Login verify-otp error:", error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};