const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdatedUser } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUpdatedUser, updateUser);

module.exports = router;
