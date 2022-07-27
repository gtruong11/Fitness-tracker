/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken")
const { createUser, getUserByUsername } = require("../db")

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);

      if (_user) {
        throw {
            name: "UsernameAlreadyExists",
            message: "There is already a user by this username"
        }
        }

        if (password.length < 8) {
            next({
                name: "PasswordToShort",
                message: "The password must be 8 or more characters long"
            })
          }
      

      const user = await createUser({
        username,
        password
      });

      if (!user) {
        next({
            name: "UserCreateError",
            message: "Error creating user"
        })
      }
      
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "thank you for signing up",
        token,
        user
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
