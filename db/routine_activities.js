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
  try{
    const {rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId" =${id};
    `);
    return rows;
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
    const {rows: [routine]}= await client.query(`
    DELETE FROM routine_activities
    WHERE id =$1
    RETURNING *
    `,[id])
  return routine

  } catch (error) {
    throw (error)
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const{rows: [routineActivity]} = await client.query(`
  SELECT * FROM routine_activities
  JOIN routines ON routine_activities."routineId" = routines.id
  AND routine_activities.id = $1
  `,[routineActivityId])

  if (routineActivity.creatorId === userId) {
    return routineActivity
  } else {
    return false
  }
  // return routineActivity.creatorId === userId, console.log(routineActivity,"show me the money")
};
 

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
