const express = require('express');
require("dotenv").config();
const router = express.Router();
const usersRouter = require('./users');
const activitiesRouter = require('./activities');
const routinesRouter = require('./routines');
const routineActivitiesRouter = require('./routineActivities');
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = process.env
const {getUserById} = require("../db")


// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
    res.send({message: "all is well"})
    } catch (error) {
      next (error)
    }
});

router.get('/unknown', async (req, res, next) => {
  try {
    res.status(404)
    res.send({message: "error 404"})
  } catch(error) {
    next (error)
  }
})

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
  
    if (!auth) {
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });

  // router.use((req, res, next) => {
  //   if (req.user) {
  //     console.log("User is set:", req.user);
  //   }
  
  //   next();
  // });

router.use('/users', usersRouter);
router.use('/activities', activitiesRouter);
router.use('/routines', routinesRouter);
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;

