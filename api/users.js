/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
    getUserByUsername,
    createUser,
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
