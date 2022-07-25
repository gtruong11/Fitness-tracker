/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require('bcrypt')

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
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
    return user, hashedPassword;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)
  if(hashedPassword == isValid){
    return true
  }
  return false

}

async function getUserById(userId) {
  try{
    const {rows:[user]} = await client.query(`
    SELECT id, username 
    FROM users
    WHERE id =${userId};
    `);
    if (!user) {
        return null
    }
       
    return user;
} catch (error){
    throw(error)
}
}


async function getUserByUsername(userName) {
  try{
    const {rows: [user]} = await client.query(`
    SELECT * 
    FROM users
    WHERE username =$1;

    `,[userName])
    return user
  }catch (error){
    throw error
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
