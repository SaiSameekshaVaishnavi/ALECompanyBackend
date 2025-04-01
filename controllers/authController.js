// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require("fs").promises;
// const path = require("path");

const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // const foundUser = usersDB.users.find((person) => person.username === user);
  const foundUser = await User.findOne({ username: user }).lean();
  if (!foundUser) {
    return res.status(401).json({ message: "Username doesn't exist" });
  }
  const mongooseUser = await User.findById(foundUser._id);

  if (!mongooseUser) {
    return res.status(401).json({ message: "Username doesn't exist" });
  }

  // Check password validity
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (!match) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const roles = Object.values(foundUser.roles);
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "4m" }
  );
  console.log("Generated Access Token:", accessToken);
  console.log("Extracted Roles from DB:", Object.values(foundUser.roles));
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Update user's refresh token
  // const otherUsers = usersDB.users.filter(
  //   (person) => person.username !== foundUser.username
  // );
  // const currentUser = { ...foundUser, refreshToken };
  // usersDB.setUsers([...otherUsers, currentUser]);

  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB.users, null, 2)
  // );

  // Saving refreshToken with current user
  mongooseUser.refreshToken = refreshToken;
  await mongooseUser.save();
  console.log(mongooseUser);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    accessToken,
    message: "Login successful",
    username: foundUser.username,
    roles: foundUser.roles,
  });
};

module.exports = { handleLogin };
