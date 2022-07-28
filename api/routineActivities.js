const express = require('express');
const routineActivitiesRouter = express.Router();
const { requireUser } = require('./utils')
const { getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity, canEditRoutineActivity } = require('../db')

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    console.log(routineActivityId, "first check")
    const { count, duration } = req.body;
    console.log( count, duration, "second check")
    const { username } = req.user
    const updatedRoutineActivity = await getRoutineActivityById(routineActivityId)
    try {
        if(updatedRoutineActivity.id !== req.user.id) {
            res.status(403)
            next ({
                name: "User is not found",
                message: `User ${username} is not allowed to update In the evening`
            })
        } else {
            const upToDateRoutineActivity = await updateRoutineActivity({ id: routineActivityId, count, duration });

            res.send(upToDateRoutineActivity)
        }
    } catch (error) {
        next (error)
    }
})
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req,res,next)=>{
    const { username}= req.user
    try{
        if(!await canEditRoutineActivity(req.params.routineActivityId, req.user.id)) {
            res.status(403)
            next ({
                name: "User is not found",
                message: `User ${username} is not allowed to delete In the afternoon`
            })
        } else {
            const deleteActivity = await destroyRoutineActivity(req.params.routineActivityId)

            res.send(deleteActivity)
        }
    } catch (error) {
        next (error)
    }})

module.exports = routineActivitiesRouter;
