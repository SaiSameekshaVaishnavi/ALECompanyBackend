// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fs = require("fs");
// const path = require("path");
// const employeesFilePath = path.join(__dirname, "../model/users.json");

const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
  console.log("Refresh Token from backend");
  const cookies = req.cookies;
  console.log("Cookies", cookies);
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  console.log("Refresh Token from frontend", refreshToken);

  // const usersData = fs.readFileSync(employeesFilePath, "utf8");
  // const users = JSON.parse(usersData); // Convert to JS object
  // const foundUser = users.find(
  //   (person) => person.refreshToken === refreshToken
  // );

  const foundUser = await User.findOne({ refreshToken }).lean();
  if (!foundUser) {
    console.log("I am the error");
    return res.sendStatus(403);
  } //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      console.log("I am the error during eval");
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "4m" }
    );
    res.json({
      accessToken,
      username: foundUser.username,
      roles: foundUser.roles,
    });
  });
};

module.exports = { handleRefreshToken };
