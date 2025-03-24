const router = require("express").Router();
const {
  validateClothingItem,
  validateIDs,
} = require("../middlewares/validation");

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// Create item
router.post("/", validateClothingItem, createItem);

// Get item
router.get("/", getItem);

// Delete item
router.delete("/:itemId", validateIDs, deleteItem);

// Like item
router.put("/:itemId/likes", validateIDs, likeItem);

// Unlike item
router.delete("/:itemId/likes", validateIDs, unlikeItem);

module.exports = router;
