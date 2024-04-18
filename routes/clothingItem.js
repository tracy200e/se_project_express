const router = require("express").Router();

const { createItem, getItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItem");

// Create item
router.post("/", createItem);

// Get item
router.get("/", getItem);

// Delete item
router.delete("/:itemId", deleteItem);

// Like item
router.put("/items/:itemId/likes", likeItem);

// Unlike item
router.delete("/items/:itemId/likes", unlikeItem);

module.exports = router;