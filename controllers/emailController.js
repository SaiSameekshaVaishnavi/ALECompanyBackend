const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../model/User");

// const usersDB = require("../model/users.json");
// const fsPromises = require("fs").promises;
// const path = require("path");

async function sendPasswordResetEmail(req, res) {
  const { email } = req.body;
  console.log("backend starting");

  // const user = usersDB.find((user) => user.email === email);

  const user = await User.findOne({ email }).exec();
  console.log("User found:", user);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a secure token (valid for limited time)
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.tokenExpiry = Date.now() + 15 * 60 * 1000; // Token expires in 15 mins

  // Update users.json
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB, null, 2)
  // );
  await user.save();
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

  // Send reset link via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/resetPassword?token=${resetToken}`;
  console.log("Sending email to:", user.email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: `${user.email}`,
    subject: "Password Reset Request",
    text: `Click here to reset your password: ${resetLink}`,
  });

  res.status(200).json({ message: "Password reset email sent!" });
}

module.exports = { sendPasswordResetEmail };
