const router = require("express").Router();
const { getUsers, createUser, getUser, logInUser, getCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

module.exports = router;