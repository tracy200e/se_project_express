const router = require("express").Router();
const { DOCUMENT_NOT_FOUND_ERROR } = require("../utils/errors");

const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
    res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: "Router not found."});
})

module.exports = router;