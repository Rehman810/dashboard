import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const generateCustomToken = (
  payload,
  expiresIn = "15m"
) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = {
  generateToken,
  generateCustomToken,
};
