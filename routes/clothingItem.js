const router = require("express").Router();
import { validateClothingItem } from "../middlewares/validation";

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
router.delete("/:itemId", validateClothingItem, deleteItem);

// Like item
router.put("/:itemId/likes", validateClothingItem, likeItem);

// Unlike item
router.delete("/:itemId/likes", validateClothingItem, unlikeItem);

module.exports = router;
