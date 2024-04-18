const ClothingItem = require("../models/clothingItem");
const { CAST_ERROR, DOCUMENT_NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// Create clothing item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
      }
    });
};

// Get all clothing items
const getItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

// Delete clothing item by ID
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(CAST_ERROR).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id }},
    { new: true }
  )
  .orFail()
  .then((item) => res.status(200).send({ data: item }))
  .catch((err) => {
    if (err.name === "DocumentNotFoundError") {
      res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: err.message });
    } else if (err.name === "CastError") {
      res.status(CAST_ERROR).send({ message: "Invalid data." });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    }
  });
}

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id }},
    { new: true }
  )
  .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
      }
    });
}

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
