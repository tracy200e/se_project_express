const User = require("../models/user");
const { CAST_ERROR, DOCUMENT_NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// GET all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

// GET user by ID
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
      }
    });
};

// CREATE user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ messgae: "An error has occurred on the server." });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
