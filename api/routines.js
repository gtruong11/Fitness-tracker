const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, getUserByUsername } = require('../db');
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
routinesRouter.patch('/:routineId', requireUser, async(req,res,next)=>{
    const {routineId, } = req.params;
    const { name, goal } = req.body;
    const {username} = req.user
    const updatedRoutine = await getRoutineById(routineId)
    console.log(updatedRoutine, "line 36 show me the money")
    try {
        if(updatedRoutine.creatorId !== req.user.id){
            res.status(403)
            next({
                name:"User is not found",
                message: `User ${username} is not allowed to update Every day`
            })
        }else{
        const uptodateRoutine = await updateRoutine({
          id: routineId,
          name,
          goal,
          isPublic: req.body.isPublic
        });
          
          res.send(uptodateRoutine);
        } 
      } catch (error) {
          next (error)
      }
  })
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
