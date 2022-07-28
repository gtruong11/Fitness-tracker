const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById } = require('../db');
const routinesRouter = express.Router();
const {requireUser} = require('./utils')
// GET /api/routines
routinesRouter.get('/', async(req,res,next)=>{
    const routines = await getAllPublicRoutines()
try{
    res.send(routines)

}catch(error){
    next(error)
}

})
// POST /api/routines
routinesRouter.post('/', requireUser, async(req,res,next)=>{
    const { name, goal} = req.body
   const routine = await createRoutine({creatorId: req.user.id , name, goal, isPublic: req.body.isPublic})
    try{
        if(routine){
            res.send(routine)
        }

    }catch(error){
        next(error)
    }
})


// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
