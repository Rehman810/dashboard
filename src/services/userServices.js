import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserById = async (
  id,
  data
) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteUserById = async (id) => {
  await User.findByIdAndDelete(id);
};

export const createUser = async ({
  name,
  email,
  password,
  role,
}) => {
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );
  return await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
};
