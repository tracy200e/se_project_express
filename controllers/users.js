const User = require("../models/user");
const {
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// CREATE user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hash,
      }),
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
      }),
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      } else if (err.code === 11000) {
        res
          .status(DUPLICATE_KEY_ERROR)
          .send({ message: "Duplicate key error. User email already exists!" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const logInUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return user;
    });
  })
  .catch((err) => {
    res.status(401).send({ message: err.message});
  });
};

module.exports = { getUsers, createUser, getUser, logInUser };
