const jwt = require("jsonwebtoken");
const { users } = require("../data/db");

/**
 * protect: verifies the JWT sent in the Authorization header
 * and attaches the matching user to req.user.
 */
function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
}

/**
 * adminOnly: must be used after `protect`. Blocks non-admin users
 * from reaching CRM/admin-only endpoints.
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

module.exports = { protect, adminOnly };
