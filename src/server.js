import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database initialized.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT}`
      )
    );
  } catch (error) {
    console.error(
      "Error during server initialization:",
      error.message
    );
  }
};

export default startServer;
