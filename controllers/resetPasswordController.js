const bcrypt = require("bcrypt");
const User = require("../model/User");
// const usersDB = require("../model/users.json");
// const fsPromises = require("fs").promises;
// const path = require("path");

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  // const user = usersDB.find((user) => user.resetToken === token);
  const user = await User.findOne({ resetToken: token }).exec();
  if (!user || user.tokenExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = null; // Remove the token
  user.tokenExpiry = null;

  // Update users.json
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB, null, 2)
  // );

  // Save changes in MongoDB
  await user.save();
  
  res.json({ message: "Password reset successful!", userName: user.username });
}

module.exports = { resetPassword };
