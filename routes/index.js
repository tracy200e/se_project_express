const router = require("express").Router();
const { DOCUMENT_NOT_FOUND_ERROR } = require("../utils/errors");
const { createUser, logInUser } = require("../controllers/users");

const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.post("/signin", logInUser);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
    res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: "Router not found." });
})

module.exports = router;