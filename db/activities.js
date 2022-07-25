/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [activities] } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2) 
      RETURNING *;
    `, [name,description]);

    return activities;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: [activities] } = await client.query(`
      SELECT *
      FROM activities;
    `);

    const acts = await Promise.all(activities.map(
      act => getActivityById(act.id)
    ));

    return acts;
  } catch (error) {
    throw error;
  }
}


async function getActivityById(id) {
  try{
    const {rows:[activities] } = await client.query(`
    SELECT id, name, description
    FROM users
    WHERE id =${id};
    `);
    if (!activities) {
        return null
    }   
    return activities;
} catch (error){
    throw(error)
}
}


async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }return await getActivityById(id)
  }catch (error){
    throw error
  }
  
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
