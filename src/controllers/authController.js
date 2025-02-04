import {
  registerUser,
  loginUser,
  createAdmin,
} from "../services/authentication.js";

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      phone,
    } = req.body;
    const profileImage = req.file
      ? req.file.path
      : "";

    const user = await registerUser({
      username,
      email,
      password,
      confirmPassword,
      phone,
      profileImage,
    });

    res
      .status(201)
      .json({
        message: "User registered successfully",
        user,
      });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(
      req.body.email,
      req.body.password
    );
    res.json({ token, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message });
  }
};

export const createAdminHandler = async (
  req,
  res
) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(201).json({
      message: "Admin created successfully!",
      admin,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message });
  }
};
