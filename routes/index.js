const router = require("express").Router();

const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;