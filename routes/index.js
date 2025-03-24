const router = require("express").Router();
const { createUser, logInUser } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");
const {
  validateUserCreation,
  validateUserAuthentication,
} = require("../middlewares/validation");

const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.post("/signin", validateUserAuthentication, logInUser);
router.post("/signup", validateUserCreation, createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found."));
});

module.exports = router;
