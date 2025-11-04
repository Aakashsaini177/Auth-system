import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./Routes/AuthRouter.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Correct CORS setup for Render + Vercel
app.use(
  cors({
    origin: [
      "https://auth-system-drab.vercel.app", //  Vercel frontend
      "http://localhost:3000",               // local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/auth", authRoutes);

// Product route
app.get("/products", (req, res) => {
  const products = [
    {
      name: "Laptop",
      price: 114990,
      description:
        "Apple 2025 MacBook Air (13-inch, Apple M4 chip with 10-core CPU and 10-core GPU, 16GB Unified Memory, 512GB) - Midnight",
      image:
        "https://m.media-amazon.com/images/I/71CjP9jmqZL._SL1500_.jpg",
    },
    {
      name: "iPhone 17 Pro",
      price: 134900,
      description:
        "iPhone 17 Pro 256 GB: 15.93 cm (6.3″) Display with Promotion up to 120Hz, A19 Pro Chip, Breakthrough Battery Life, Pro Fusion Camera System with Center Stage Front Camera; Deep Blue",
      image:
        "https://m.media-amazon.com/images/I/31Em5uVIfKL._SX342_SY445_QL70_FMwebp_.jpg",
    },
    {
      name: "Samsung Galaxy S25 Ultra 5G",
      price: 141999,
      description:
        "Samsung Galaxy S25 Ultra 5G Smartphone with Galaxy AI (Titanium Whitesilver, 12GB RAM, 512GB Storage), Titanium Frame, Snapdragon 8 Elite, 200 MP Camera with ProVisual Engine and 5000mAh Battery",
      image:
        "https://m.media-amazon.com/images/I/41zxe8LzGrL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      name: "vivo V60e 5G",
      price: 31999,
      description:
        "vivo V60e 5G (Elite Purple, 8GB RAM, 256GB Storage)",
      image:
        "https://m.media-amazon.com/images/I/41ptrrQH0SL._SY300_SX300_QL70_FMwebp_.jpg",
    },
  ];
  res.json(products);
});

// Server start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
