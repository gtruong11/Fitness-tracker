const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, getUserByUsername, destroyRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine } = require('../db');
const { UserDoesNotExistError } = require('../errors');
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
routinesRouter.delete('/:routineId', requireUser, async (req,res,next)=>{
    const {routineId} = req.params;
    const {username} = req.user
    const routine = await getRoutineById(routineId);
    try{
        if (routine.creatorId !== req.user.id){
            res.status(403)
            next({
                name:"User is not found",
                message: `User ${username} is not allowed to delete On even days`
            })}else{
                const deleteRoutine = await destroyRoutine(routineId)
                res.send(deleteRoutine)
            }

    }catch(error){
        next(error)
    }
})

// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async (req,res,next)=>{
    const routineId = Number(req.params.routineId)
    const {activityId, count, duration} = req.body
    console.log(routineId, activityId, count, duration, "THIS ONE")
    const obj = {routineId:routineId, activityId:activityId, count:count, duration:duration}
    try {
        const newRoutine = await addActivityToRoutine(obj)
        res.send(newRoutine)
    } catch(error) {
        next(error)
    }
})

module.exports = routinesRouter;
