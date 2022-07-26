/* eslint-disable no-useless-catch */
const client = require("./client");

//
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [combinedActivity] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    return combinedActivity;
  } catch (error) {
    throw error;
  }
}


async function getRoutineActivityById(id) {
  try{
    const {rows:[routineactivity] } = await client.query(`
    SELECT id, "routineId", "activityId", count, duration
    FROM routine_activities
    WHERE id =${id};
    `);
    if (!routineactivity) {
        return null
    }   
    return routineactivity;
} catch (error){
    throw(error)
}
}

async function getRoutineActivitiesByRoutine({ id }) {
  console.log(id, "WHAT IS THIS?")
  try{
    const {rows:[routineactivity] } = await client.query(`
    SELECT id, "routineId", "activityId", count, duration
    FROM routine_activities
    WHERE "routineId" =${id};
    `);
    if (!routineactivity) {
        return null
    }   
    return routineactivity;
} catch (error){
    throw(error)
}
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    if (setString.length > 0) {
      await client.query(`
        UPDATE routine_activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }return await getRoutineActivityById(id)
  }catch (error){
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try {
    const noroutineactivity = await client.query(`
    DELETE FROM routine_activities
    WHERE id =${id};
    `)
  return noroutineactivity

  } catch (error) {
    throw (error)
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
