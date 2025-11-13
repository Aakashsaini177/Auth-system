  import User from "../Models/User.js";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import crypto from "crypto";
import sendEmail from "../Config/mail.js";

  // Register User
  export const registerUser = async (req, res) => {
      try {
      const { username, email, password } = req.body;
      
      // check if already exists
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ success: false, message: "User already exists" });

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create new user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };

  // Login User
  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({success:false, message: "User not found." });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token and expiry in the database
    user.resetToken = {
      token: resetToken,
      expiresAt: Date.now() + 1000 * 60 * 20, // Token valid for 20 minutes
    };
    await user.save();

    console.log(user);

    // Send email with reset link
    const resetLink = `${process.env.NODE_ENV === "production" 
      ? process.env.ORIGIN 
      : "http://localhost:5173"}/resetpassword/${resetToken}`;
    sendEmail(
      email,
      "Password Reset Request",
      `Password Reset Request
      Click the link below to reset your password. The link is valid for 20 minutes.
      ${resetLink}`,
      `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password. The link is valid for 20 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
    `
    );

    res
      .status(200)
      .json({ success:true, message: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Error requesting password reset." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log(password)

    // Find the user by the reset token
    const user = await User.findOne({
      "resetToken.token": token,
      "resetToken.expiresAt": { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.log(user);
      return res.status(400).json({ success:false, message: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();
    sendEmail(
      user.email,
      "Password Reset Successful",
      "Your password has been reset successfully.",
      `
      <h1>Password Reset Successful</h1>
      <p>Your password has been reset successfully.</p>
    `
    );
    res.status(200).json({success:true, message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Error resetting password." });
  }
};
