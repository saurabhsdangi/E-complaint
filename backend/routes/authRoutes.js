const express = require("express");
const router = express.Router();
const { signup, login, resetPassword, checkUsername,  getUsername } = require("../controllers/authControllers");


router.post("/signup", signup);
router.post("/login", login);
router.put("/reset-password", resetPassword);
router.post("/check-username", checkUsername);
router.post("/get-username", getUsername);

module.exports = router;
