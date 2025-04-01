const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  console.log("Verify JWT middleware called"); // Debugging statement
  console.log("Full Authorization:", req.headers);
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Authorization header missing or incorrect");
    return res.sendStatus(401); // Unauthorized
  }
  const token = authHeader.split(" ")[1];
  if (typeof token === "object" && token.accessToken) {
    console.error("Token is an object instead of a string:", token);
    token = token.accessToken;
  }
  console.log("Extracted Token:", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification failed:", err.message);
      return res.sendStatus(403);
    } //invalid token
    console.log("Decoded JWT:", decoded);
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
