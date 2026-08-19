const otpStore = require("./otpStore");

const verifyOTP = async (phone, otp) => {
  const storedData = otpStore.get(phone);

  if (!storedData) {
    return {
      status: "pending",
      message: "OTP not found",
    };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phone);

    return {
      status: "pending",
      message: "OTP expired",
    };
  }

  if (storedData.otp !== otp.toString()) {
    return {
      status: "pending",
      message: "Invalid OTP",
    };
  }

  otpStore.delete(phone);

  return {
    status: "approved",
    message: "OTP verified successfully",
  };
};

module.exports = verifyOTP;
