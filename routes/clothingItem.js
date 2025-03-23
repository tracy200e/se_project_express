const router = require("express").Router();
const { Joi, celebrate } = require("celebrate");

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// Create item
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      imageUrl: Joi.string().uri.required(),
      name: Joi.string().required.min(2).max(30),
      weather: Joi.string().required().validate("hot", "warm", "cold"),
    }),
  }),
  createItem,
);

// Get item
router.get("/", getItem);

// Delete item
router.delete(
  "/:itemId",
  celebrate({
    body: Joi.object().keys({
      imageUrl: Joi.string().uri.required(),
      name: Joi.string().required.min(2).max(30),
      weather: Joi.string().required().validate("hot", "warm", "cold"),
    }),
  }),
  deleteItem,
);

// Like item
router.put(
  "/:itemId/likes",
  celebrate({
    body: Joi.object().keys({
      imageUrl: Joi.string().uri.required(),
      name: Joi.string().required.min(2).max(30),
      weather: Joi.string().required().validate("hot", "warm", "cold"),
    }),
  }),
  likeItem,
);

// Unlike item
router.delete(
  "/:itemId/likes",
  celebrate({
    body: Joi.object().keys({
      imageUrl: Joi.string().uri.required(),
      name: Joi.string().required.min(2).max(30),
      weather: Joi.string().required().validate("hot", "warm", "cold"),
    }),
  }),
  unlikeItem,
);

module.exports = router;
