import {
  registerUser,
  loginUser,
  createAdmin,
  sendPasswordResetLink,
  resetPasswordWithToken,
  verifyEmailWithToken,
  sendVerificationEmail,
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

    await sendVerificationEmail(email);

    res.status(201).json({
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


export const forgotPassword = async (req, res) => {
  try {
    await sendPasswordResetLink(req.body.email);
    res.json({ message: 'Password reset link sent.' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await resetPasswordWithToken(token, newPassword);
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    await verifyEmailWithToken(token);
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};