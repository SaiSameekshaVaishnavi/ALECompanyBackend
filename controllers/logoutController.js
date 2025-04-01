// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require("fs").promises;
// const path = require("path");

const User = require("../model/User");

const handleLogout = async (req, res) => {
  console.log("Backend called in backend");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  // const otherUsers = usersDB.users.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: "" };
  // usersDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB.users)
  // );

  await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" });
  console.log("Backend clearing cookie");
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  console.log("Backend cleared cookie and sending status");
  res.sendStatus(204);
};

module.exports = { handleLogout };
