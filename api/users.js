/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername, getUser, getUserById } = require("../db");
const bcrypt = require("bcrypt");
const { router } = require("../app");

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.status(401)
      next({
        error: "401",
        message: `User ${username} is already taken.`,
        name: "useralreadyexists"
        
      });
    }

    if (password.length < 8) {
      res.status(401)
      next({
        error: "401",
        message: "Password Too Short!",
        name: "PasswordtooShort"
      });
    }

    const user = await createUser({
      username,
      password,
    });

    // if (!user) {
    //   res.status(401)
    //   next({
    //     name: "UserCreateError",
    //     message: "Error creating user",
    //   });
    // }

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
  } catch ( error ) {
    next( error);
  }
});
// POST /api/users/login

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  
 
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUser({username,password})
    
    if (user) {
      const token = jwt.sign({ 
        id: user.id, 
        username: user.username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
      
      res.send({ user, message: "you're logged in!", token});
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me
usersRouter.get("/me", getUserById, async (req,res,next)=>{
  try{
    
    res.send(req.user)
  }catch (error){
    next(error)
  }
})

// GET /api/users/:username/routines

module.exports = usersRouter;
