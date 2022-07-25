const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const {rows: [activity]} = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        RETURNING *;
    `, [name, description])
    return activity
} catch(error) {
    console.error(error)
}
}

async function getAllActivities() {
  try {
    const {rows} = await client.query(`
     SELECT * FROM activities
    `)
    return rows
  } catch(error){
    console.error(error)
  }
}

async function getActivityById(id) {
  try{
    const {rows:[activity],} = await client.query(`
    SELECT * 
    FROM activities
    WHERE id = $1;
    `,[id]);

    if(!activity){
        throw {
            name: "ActivityNotFoundError",
            message: "could not find an activty with that id"
        }
    }

    return activity 
} catch(error){
    console.error(error)
}
}

async function getActivityByName(name) {
  try{
    const {rows: [activity],} = await client.query(`
    SELECT *
    FROM activities
    WHERE name = $1
    `, [name]);
    return activity
  } catch(error){
    console.error(error)
  }
}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
    ).join(',') 
    try {
    if (setString.length > 0){
      await client.query(`
      UPDATE activities
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
      `, Object.values(fields)) 
    }
    return await getActivityById(id)
    } catch(error){
      console.error(error)
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
