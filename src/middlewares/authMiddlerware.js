import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({
        msg: "No token, authorization denied",
      });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ msg: "Invalid token" });
  }
};

export const authorizeAdmin = (
  req,
  res,
  next
) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        msg: "Access denied. Admins only.",
      });
  }
  next();
};
