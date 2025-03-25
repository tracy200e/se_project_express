const router = require("express").Router();
const {
  validateClothingItem,
  validateIDs,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// Create item
router.post("/", auth, validateClothingItem, createItem);

// Get item
router.get("/", getItem);

// Delete item
router.delete("/:itemId", auth, validateIDs, deleteItem);

// Like item
router.put("/:itemId/likes", auth, validateIDs, likeItem);

// Unlike item
router.delete("/:itemId/likes", auth, validateIDs, unlikeItem);

module.exports = router;
