/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const bcrypt = require("bcrypt");
const { router } = require("../app");
const { requireUser } = require("./utils");

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.status(401);
      next({
        message: `User ${username} is already taken.`,
        name: "useralreadyexists",
      });
    }

    if (password.length < 8) {
      res.status(401);
      next({
        message: "Password Too Short!",
        name: "PasswordtooShort",
      });
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
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      user,
      message: "thank you for signing up",
      token,
    });
  } catch (error) {
    next(error);
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
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({ user, message: "you're logged in!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  console.log(req.user, "THIS IS THE BODY");
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", requireUser, async (req, res, next) => {
  const { username } = req.params;
  const user = await getUserByUsername(username)
  try {
  
    if (!user) {
      next({
        name: "NoUser",
        message: `User ${username} does not exist`
      })
      
    } else if(user.id == req.user.id ){
     
      const fullList = await getAllRoutinesByUser({username: username})
      res.send(fullList)
    } else{
      const publicList = await getPublicRoutinesByUser({username: username})
      res.send(publicList)
    }
  } catch (error) {
    throw error;
  }
});
module.exports = usersRouter;
