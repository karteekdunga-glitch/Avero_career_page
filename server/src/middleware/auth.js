// server/src/middleware/auth.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Restrict only to @averoadvisors.com emails
    if (!decoded.email.endsWith("@averoadvisors.com")) {
      return res.status(403).json({ error: "Admins must use averoadvisors.com email" });
    }

    req.user = decoded; // make user available downstream
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
