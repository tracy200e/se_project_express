const router = require("express").Router();
const { createUser, logInUser } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.post("/signin", logInUser);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found."));
});

module.exports = router;
