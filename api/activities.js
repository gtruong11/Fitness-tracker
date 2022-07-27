const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  console.log("outside try");
  try {
    console.log("inside try");
    const activities = await getAllActivities();
    console.log(activities, "Show me the money 14");
    res.send(activities);
  } catch (error) {
    next(error);
  }
});
// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { id } = req.activities;
  const allActivities = await getPublicRoutinesByActivity({ id });
  try {
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const activityData = {};
  const existingActivity = await getActivityByName(name);

  if (existingActivity) {
    next({
      name: "ActivityExists",
      message: `An activity with name ${name} already exists`,
    });
  }

  console.log("INSIDE ACTIVITIESPOST FUNCTION");
  try {
    console.log("INSIDE THE TRY OF THAT");
    activityData.name = name;
    activityData.description = description;
    const activity = await createActivity(activityData);
    console.log(activity, "DID WE CREATE IT?");
    if (activity) {
      res.send(activity);
    }
  } catch (error) {
    next(error);
  }
});
// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  console.log(activityId, "ACTIVITYID")
  const { name, description } = req.body;
  const originalActivity = await getActivityById(activityId);
  const orginalActivities = await getAllActivities()
  const filteredActivities = orginalActivities.filter((activity) => {
    return activity.name === name
  })
  console.log(filteredActivities, "THIS IS STUFF")

  try {
    if (!originalActivity) {
      next({
        name: "NoActivityFound",
        message: `Activity ${activityId} not found`,
      });
    } else {
      const updatedActivity = await updateActivity({
        id: activityId,
        name,
        description,
      });
      console.log(filteredActivities[0].id, "THIS IS THE STUFF")
      if (filteredActivities[0].id === activityId) {
        
        res.send(updatedActivity);
      } else {
        next({
          name: "FailedToUpdate",
          message: `An activity with name ${name} already exists`,
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
