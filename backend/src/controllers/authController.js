import { signupSchema, loginSchema } from "../validators/auth_validator.js";
import { generatedToken } from "../lib/utlis.js";
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { z } from "zod"; // For error handling
import cloudinary from "../lib/cloudinary.js";


// Signup Controller
export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { fullName, email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generatedToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generatedToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout Controller
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Profile Controller
export const updateprofile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload the profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Update the user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ messag: " Internal server error" });
  }
};
