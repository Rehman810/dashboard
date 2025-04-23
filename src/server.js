import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "🚀 Backend API is running on Vercel!"
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

export default startServer;
