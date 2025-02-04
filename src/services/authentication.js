import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  registerValidation,
  loginValidation,
  createAdminValidation,
} from "../validations/authValidation.js";

export const registerUser = async ({ username, email, password, confirmPassword, phone, profileImage }) => {
  const { error } = registerValidation.validate({ username, email, password, confirmPassword, phone, profileImage });
  if (error) throw new Error(error.details[0].message);

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) throw new Error("Email or Phone number already registered.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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
