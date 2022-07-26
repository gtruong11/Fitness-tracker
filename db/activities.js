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
    const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


async function getActivityById(id) {
  try{
    const {rows:[activities] } = await client.query(`
    SELECT id, name, description
    FROM activities
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


async function getActivityByName(name) {
  try {
    const {rows:[activites]} = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name]);
    if (!activites) {
      return null
    }
    return activites;
  }catch (error) {
    throw(error)
  }
}

async function attachActivitiesToRoutines(routines) {
  console.log("TRY STATEMENT STARTED")
  try {
    console.log("BEFORE QUERY")
    const {rows:[data]} = await client.query(`
      SELECT 
      FROM activities
      FULL JOIN routines.id ON acitivities.id  
    `, [routines]);
    console.log(data, "THIS IS OUR DATA")
    return data
  } catch (error) {
    throw (error)
  }
}

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
        UPDATE activities
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
