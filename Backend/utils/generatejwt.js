const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateJWT = (user) => {

    const payload = {
        id: user.id,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.is_phone_verified
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    );
};

module.exports = generateJWT;