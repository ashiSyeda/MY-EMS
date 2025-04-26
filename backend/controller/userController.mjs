import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.mjs";
import dotenv from "dotenv";

let refreshTokens = []; // In-memory store for refresh tokens (for demo purposes)

// Signup
export const signup = async (req, res) => {
  try {
    const { email, password, name, gender, position, role } = req.body;

    if (!email || !password || !name || !gender || !position) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingEmployee = await Employee.findOne({ email: email.trim() });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const newEmployee = new Employee({
      email: email.trim(),
      password,
      name,
      gender,
      position,
      role: role || "employee",
      joinDate: new Date()
    });

    await newEmployee.save();

    const token = jwt.sign(
      { email: newEmployee.email, id: newEmployee._id, role: newEmployee.role },
      process.env.JWT_SECRET,
      { expiresIn: "32h" }
    );

    const { password: _, ...employeeData } = newEmployee.toObject();

    res.status(201).json({ 
      message: "Signup successful",
      user: employeeData,
      token 
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "Signup failed", 
      error: error.message 
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const employee = await Employee.findOne({ email: email.trim() });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { 
        id: employee._id,
        email: employee.email,
        role: employee.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    const { password: _, ...employeeData } = employee.toObject();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: employeeData
    });

  } catch (error) {
    console.error("Login error:", error);
    console.error(error.stack);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Refresh token endpoint
export const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Refresh token required" });
  if (!refreshTokens.includes(token)) return res.status(403).json({ message: "Invalid refresh token" });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id)
      .select("-password")
      .populate("leaveInfo");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, gender, contact, department } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.user.id,
      { name, gender, contact, department },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Renamed isAdmin controller function to checkAdminStatus
export const checkAdminStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await Employee.findById(userId).select('role');

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
        isAdmin: false
      });
    }

    if (user.role !== "admin") {
      console.log("❌ User is not an admin");
      return res.status(403).json({
        success: false,
        message: "Access denied - Admin privileges required",
        isAdmin: false
      });
    }

    console.log("✔ User is an admin");
    return res.status(200).json({
      success: true,
      message: "User has admin privileges",
      isAdmin: true
    });

  } catch (error) {
    console.error("⚠ Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin verification",
      isAdmin: false
    });
  }
};

export default { signup, login, getDashboard, getProfile, updateProfile, checkAdminStatus };
