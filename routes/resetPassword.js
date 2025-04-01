const express = require("express");
const router = express.Router();
const rpController = require("../controllers/resetPasswordController");

router.post("/", rpController.resetPassword);

module.exports = router;
