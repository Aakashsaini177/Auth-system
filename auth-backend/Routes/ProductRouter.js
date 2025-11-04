
import express from "express";
import ensureAuthenticated from "../Middlewares/Auth.js";

const router = express.Router();

// Protected route: Only logged-in users can access
router.get("/", ensureAuthenticated, (req, res) => {
  console.log("---- Logged in user ----", req.user);

  // Sample static products (you can later fetch from DB)
  res.status(200).json([
    { name: "Mobile", price: 10000, description: "Latest smartphone" },
    { name: "TV", price: 20000, description: "Smart LED TV" },
    { name: "Laptop", price: 55000, description: "Powerful work machine" },
  ]);
});

export default router;
