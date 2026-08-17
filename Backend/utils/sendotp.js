const otpStore = require("./otpStore");

const sendOTP = async (phone) => {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP for 5 minutes
  otpStore.set(phone, {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  // For development/testing only
  console.log(`=================================`);
  console.log(`OTP for ${phone}: ${otp}`);
  console.log(`Expires in: 5 minutes`);
  console.log(`=================================`);

  return {
    status: "pending",
  };
};

module.exports = sendOTP;