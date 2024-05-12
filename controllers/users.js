const User = require("../models/user");
const {
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// GET user by ID
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        res.status(CAST_ERROR).send({ message: "Invalid data." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
      });
};

// CREATE user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: "This email address already exists." });
    }

    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({
          name,
          avatar,
          email,
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
          return res.status(CAST_ERROR).send({ message: "Invalid data." });
        }
        if (err.name === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "This email already exists."});
        }
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      });
  });
};

// Log in
const logInUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(CAST_ERROR).send({ message: "Email address and password are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(FORBIDDEN_ERROR).send({ message: "Unauthorized." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// UPDATE user
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(201).send(user))
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

module.exports = {
  getUsers,
  createUser,
  logInUser,
  getCurrentUser,
  updateUser,
};
