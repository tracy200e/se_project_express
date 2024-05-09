const router = require("express").Router();
const { getUsers, createUser, getUser, logInUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.post("/login", logInUser);

module.exports = router;