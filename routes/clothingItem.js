const router = require("express").Router();

const { createItem, getItem, updateItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItem");

// Create item
router.post("/", createItem);

// Read item
router.get("/", getItem);

// Update item
router.put("/:itemId", updateItem);

// Delete item
router.delete("/:itemId", deleteItem);

// Like item
router.put("/items/:itemId/likes", likeItem);

// Unlike item
router.delete("/items/:itemId/likes", unlikeItem);

module.exports = router;