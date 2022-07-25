const client = require("./client");
const bcrypt = require('bcrypt');


// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT); 
  const {rows:[user]}  = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING username, id;
  `, [username, hashedPassword]);
  
  return user;
}


async function getUser({username, password}) {

  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  if (passwordsMatch) {
    const {rows} = await client.query(`
      SELECT id, username
      FROM users
      `);
      return rows;
} else {
    return  
}  
}

async function getUserById(userId) {
 const { rows: [user]} = await client.query(`
   SELECT id, username
   FROM users
   WHERE id = ${userId}
 `);
 if(!user){
   return null
 }
 return user
}

async function getUserByUsername(username) {
  const { rows: [user]} = await client.query(`
     SELECT *
     FROM users
     WHERE username = $1;
    `, [username]);

    return user;
} 



module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
