const otpStore = require("./otpStore");

const verifyOTP = async (phone, otp) => {
  const storedData = otpStore.get(phone);

  // No OTP found
  if (!storedData) {
    return {
      status: "pending",
    };
  }

  // OTP expired
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phone);

    return {
      status: "pending",
    };
  }

  // OTP doesn't match
  if (storedData.otp !== otp.toString()) {
    return {
      status: "pending",
    };
  }

  // OTP is correct
  otpStore.delete(phone);

  return {
    status: "approved",
  };
};

module.exports = verifyOTP;