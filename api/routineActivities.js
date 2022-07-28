const express = require('express');
const routineActivitiesRouter = express.Router();
const { requireUser } = require('./utils')
const { getRoutineActivityById, updateRoutineActivity } = require('../db')

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    console.log("inside of patch")
    const { routineActivityId } = req.params;
    console.log(routineActivityId, "first check")
    const { count, duration } = req.body;
    console.log( count, duration, "second check")
    const { username } = req.user
    console.log("third check")
    const updatedRoutineActivity = await getRoutineActivityById(routineActivityId)
    console.log("outside of try 12")
    try {
        console.log("inside of try 14")
        if(updatedRoutineActivity.id !== req.user.id) {
            console.log("inside of if 16")
            res.status(403)
            next ({
                name: "User is not found",
                message: `User ${username} is not allowed to update In the evening`
            })
        } else {
            console.log("inside of else")
            const upToDateRoutineActivity = await updateRoutineActivity({ id: count, duration });

            res.send(upToDateRoutineActivity)
        }
    } catch (error) {
        next (error)
    }
})
// DELETE /api/routine_activities/:routineActivityId

module.exports = routineActivitiesRouter;
