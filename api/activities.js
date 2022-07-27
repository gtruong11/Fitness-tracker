const express = require('express');
const activitiesRouter = express.Router();
const {getAllActivities, getActivityById, createActivity, updateActivity, getActivityByName}= require("../db")
const {requireUser} = require("./utils")



// GET /api/activities
activitiesRouter.get('/', async (req,res,next)=>{
    console.log("outside try")
    try{
        console.log("inside try")
        const activities = await getAllActivities();
        console.log(activities, "Show me the money 14")
        res.send(activities)
    }catch (error){
        next(error)
    }
})
// GET /api/activities/:activityId/routines

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
