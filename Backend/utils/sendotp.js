const otpStore = require("./otpStore");

const sendOTP = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(phone, {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  console.log("=================================");
  console.log(`OTP for ${phone}: ${otp}`);
  console.log("Expires in: 5 minutes");
  console.log("=================================");

  return {
    status: "pending",
  };
};

module.exports = sendOTP;
