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

const handleNewUser = async (req, res) => {
  const { user, pwd, email } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate usernames and emails in the db
  const existingUser = await User.findOne({
    $or: [{ username: user }, { email: email }], // Check if either username OR email exists
  }).exec();

  if (existingUser) {
    if (existingUser.username === user) {
      return res.status(409).json({ message: "Username already exists" }); // Conflict
    }
    if (existingUser.email === email) {
      return res.status(409).json({ message: "Email already exists" }); // Conflict
    }
  }

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // const newUser = {
    //   username: user,
    //   roles: { User: 2001 },
    //   password: hashedPwd,
    //   email: email,
    // };
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);

    //create and store the new user
    const newUser = await User.create({
      username: user,
      email: email,
      password: hashedPwd,
    });
    console.log(newUser);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
