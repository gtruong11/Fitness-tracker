/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");
const { getUserByUsername } = require("./users");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT id, "creatorId", "isPublic", name, goal
    FROM routines
    WHERE id =${id};
    `);
    if (!routine) {
      return null;
    }
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines;
    `);
    if (!rows) {
      return null;
    }
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    `);
    const allRoutines = attachActivitiesToRoutines(routines);
    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    WHERE "isPublic" = true
    `);
    const allRoutines = attachActivitiesToRoutines(routines);
    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    WHERE "creatorId" = $1;
    `,
      [user.id]
    );
    const allRoutines = attachActivitiesToRoutines(routines);
    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id 
    WHERE "creatorId" = $1
    AND "isPublic" = true;
    `,
      [user.id]
    );
    const allRoutines = attachActivitiesToRoutines(routines);
    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id 
  JOIN routine_activities ON routine_activities."routineId" = routines.id
  WHERE routines."isPublic" = true
  AND routine_activities."activityId" =$1;
  `,
      [id]
    );
    const allRoutines = attachActivitiesToRoutines(routines);
    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }
    return await getRoutineById(id);
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
    DELETE FROM routine_activities
    WHERE "routineId" =$1;
    `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
    DELETE FROM routines
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

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
