const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  // eslint-disable-next-line no-useless-catch
  console.log("starting createUser")
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password]
    );
      console.log("finished creating users")
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
