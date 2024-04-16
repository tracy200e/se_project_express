const ClothingItem = require("../models/clothingItem");
const { CAST_ERROR, VALIDATION_ERROR, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// Create clothing item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err === "ValidationError") {
        res.status(VALIDATION_ERROR).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

// Get all clothing items
const getItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// Update clothing item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(CAST_ERROR).send({ data: item }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// Delete clothing item by ID
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id }},
    { new: true }
  )
  .orFail()
  .then((item) => res.status(CAST_ERROR).send({ data: item }))
  .catch((err) => {
    res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
  });
}

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndDelete(
    req.params.itemId,
    { $pull: { likes: req.user._id }},
    { new: true }
  )
  .orFail()
    .then((item) => res.status(204).send({ data: item }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

module.exports = { createItem, getItem, updateItem, deleteItem, likeItem, unlikeItem };
