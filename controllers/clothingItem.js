const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

// Create clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data entered."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data entered."));
      } else {
        next(err);
      }
    });
};

// Get all clothing items
const getItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

// Delete clothing item by ID
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("This item does not belong to you"));
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data."));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data entered."));
      } else {
        next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data entered."));
      } else {
        next(err);
      }
    });
};

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
