const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createItem, getItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItem");

// Create item
router.post("/", auth, createItem);

// Get item
router.get("/", getItem);

// Delete item
router.delete("/:itemId", auth, deleteItem);

// Like item
router.put("/:itemId/likes", auth, likeItem);

// Unlike item
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;