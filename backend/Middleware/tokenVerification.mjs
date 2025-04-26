import jwt from "jsonwebtoken";
import "dotenv/config";
import Employee from "../models/Employee.mjs";

export const tokenVerification = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error("Token verification error: Authorization header missing");
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Token verification error: Token missing in Authorization header");
      return res.status(401).json({ message: "Authorization token required" });
    }

    console.log("Token received for verification:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id).select('-password');

    if (!employee) {
      console.error("Token verification error: Invalid token - user not found");
      return res.status(401).json({ message: "Invalid token - user not found" });
    }

    req.user = employee;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { isAdmin };
