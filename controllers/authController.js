import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Register User
export const register = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { username, email, password } = req.body;

    // ✅ Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Error in Register:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "7d" });

    res.json({ token, user });

  } catch (error) {
    console.error("❌ Error in Login:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Guest Login
export const guestLogin = async (req, res) => {
  try {
    const guestName = `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
    const guestEmail = `${guestName.toLowerCase()}@guest.com`;

    let user = await User.findOne({ email: guestEmail });

    if (!user) {
      // ✅ Store guest user in DB with a random hashed password
      const hashedPassword = await bcrypt.hash("guest_password", 10);
      user = new User({ username: guestName, email: guestEmail, password: hashedPassword });
      await user.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id, guest: true }, process.env.JWT_KEY, { expiresIn: "1h" });

    res.json({ token, user: { username: guestName, email: guestEmail, guest: true } });

  } catch (error) {
    console.error("❌ Error in Guest Login:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
