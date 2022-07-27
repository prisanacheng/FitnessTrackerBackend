/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const bcrypt = require('bcrypt');
const {
    getUserByUsername,
    createUser,
    getUser,
  } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const _user = await getUserByUsername(username);
      if (_user) {
          res.status(401)
        next({
          name: "UserExistsError",
          message: `User ${username} is already taken.`,
        });
      }
      
      if (password.length < 8){
          res.status(401)
          next({
              name: "PasswordLengthError",
              message: "Password Too Short!",
          })
      }
      const user = await createUser({
        username,
        password,
      });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET,
        { expiresIn: "5w" }
      );
      res.send({
        user,
        message: "Thank you for signing up",
        token,
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      const token = jwt.sign(
        user,
        JWT_SECRET
      );
      res.send({ user, message: "you're logged in!", token: token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  
  try {
    res.send(req.user)
   
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines

module.exports = usersRouter;
