const client = require("./client");

// database functions

// user functions
async function createUser({ username, password, name }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name) 
      VALUES($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password, name]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
