import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
} from "../services/userServices.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res
      .status(404)
      .json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserById(
      req.params.id,
      req.body
    );
    res.json(updatedUser);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deleteUserById(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message });
  }
};
