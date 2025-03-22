const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// GET user by ID
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
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

// CREATE user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError("This email address already exists."));
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
      .then((newUser) =>
        res.status(201).send({
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        }),
      )
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data."));
        } else if (err.code === 11000) {
          next(new ConflictError("This email address already exists."));
        } else {
          next(err);
        }
      });
  });
};

// Log in
const logInUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return new BadRequestError("Email address and password are required.");
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
        next(new UnauthorizedError("Unauthorized."));
      } else {
        next(err);
      }
    });
};

// UPDATE user
const updateUser = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  logInUser,
  getCurrentUser,
  updateUser,
};
