import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  registerValidation,
  loginValidation,
  createAdminValidation,
} from "../validations/authValidation.js";

export const registerUser = async ({
  username,
  email,
  password,
  confirmPassword,
  phone,
  profileImage,
}) => {
  const { error } = registerValidation.validate({
    username,
    email,
    password,
    confirmPassword,
    phone,
    profileImage,
  });
  if (error)
    throw new Error(error.details[0].message);

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (existingUser)
    throw new Error(
      "Email or Phone number already registered."
    );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  const user = new User({
    username,
    email,
    password: hashedPassword,
    phone,
    profileImage: profileImage || "",
  });

  await user.save();
  return user;
};

export const loginUser = async (
  email,
  password
) => {
  const { error } = loginValidation.validate({
    email,
    password,
  });
  if (error)
    throw new Error(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user)
    throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isMatch)
    throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

export const createAdmin = async ({
  email,
  password,
  secretKey,
}) => {
  const { error } =
    createAdminValidation.validate({
      email,
      password,
      secretKey,
    });
  if (error)
    throw new Error(error.details[0].message);

  if (
    secretKey !== process.env.ADMIN_SECRET_KEY
  ) {
    throw new Error("Invalid secret key!");
  }

  const existingAdmin = await User.findOne({
    email,
  });
  if (existingAdmin)
    throw new Error("Admin already exists!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  const admin = new User({
    email,
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  return admin;
};

export const sendVerificationEmail = async (
  email
) => {
  const token = generateCustomToken(
    { email },
    "1d"
  );
  const url = `http://localhost:3000/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify Your Email",
    `Click this link to verify your email: ${url}`
  );
};

export const verifyEmailWithToken = async (
  token
) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findOne({
      email: decoded.email,
    });
    if (!user) throw new Error("User not found");

    user.isVerified = true;
    await user.save();
    return true;
  } catch {
    throw new Error("Invalid or expired token");
  }
};

export const sendPasswordResetLink = async (
  email
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const token = generateCustomToken(
    { id: user._id },
    "15m"
  );
  const url = `http://localhost:3000/reset-password?token=${token}`;

  await sendEmail(
    email,
    "Verify Your Email",
    `<p>Hi,</p>
     <p>Please verify your email by clicking the link below:</p>
     <a href="${url}">${url}</a>
     <p>This link will expire in 24 hours.</p>`
  );
};

export const resetPasswordWithToken = async (
  token,
  newPassword
) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const hashed = await bcrypt.hash(
      newPassword,
      10
    );
    await User.findByIdAndUpdate(decoded.id, {
      password: hashed,
    });
    return true;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
