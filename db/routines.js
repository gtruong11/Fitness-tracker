/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Starting createRoutine")
  try {
    console.log("Inside try statement")
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    console.log("Query worked!!!!!!!")
    return routine;
  } catch (error) {
    throw error;
  }
}


async function getRoutineById(id) {
  try{
    const {rows:[routine] } = await client.query(`
    SELECT id, "creatorId", "isPublic", name, goal
    FROM routines
    WHERE id =${id};
    `);
    if (!routine) {
        return null
    }   
    return routine;
} catch (error){
    throw(error)
}
}

async function getRoutinesWithoutActivities() {

  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines
    `);
    if (!rows) {
      return null
    }
    return rows
  } catch (error) {
    throw(error)
  }
}

async function getAllRoutines() {
  try {
    
  } catch (error) {
    throw (error)
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
