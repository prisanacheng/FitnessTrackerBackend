/* eslint-disable no-empty */
/* eslint-disable no-useless-catch */
const client = require("./client");


async function addActivityToRoutine({
  routineId,
  activityId,
  duration,
  count,
}) {
  try {
    const {rows: [routine_activity]} = await client.query (`
    INSERT INTO routine_activities ("routineId", "activityId", duration, count)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `,[routineId, activityId, duration, count])
   return routine_activity  
   }catch (error){
     throw error
   }
}

async function getRoutineActivityById(id) {
  try{
    const {rows:[routine_activity],} = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id = $1;
    `,[id]);

    
    return routine_activity
} catch(error){
    throw error
}
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
      const {rows:routine_activity,} = await client.query(`
      SELECT * 
      FROM routine_activities
      WHERE routine_activities.id = ${id};
      `);
  

    return routine_activity
  } catch(error){
    throw error
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
    ).join(',') 
    try {
    if (setString.length > 0){
      await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE routine_activities.id = ${id}
      RETURNING *;
      `, Object.values(fields)) 
    }
    return await getRoutineActivityById(id) 
    } catch(error){
      throw error
    }

}

async function destroyRoutineActivity(id) {
  try {
    const {rows:[routine_activity]} = await client.query(`
    DELETE 
    FROM routine_activities
    WHERE routine_activities."routineId" = $1
    RETURNING *
    `, [id])
    
    return routine_activity
  } catch(error){
    throw error
  }

}

async function canEditRoutineActivity(routineActivityId, userId) {
 try{
   const {rows: [routine_activity]} = await client.query(`
   SELECT *
   FROM routine_activities
   JOIN routines ON routine_activities."routineId" = routines.id AND routine_activities.id = $1
  
   `,[routineActivityId])
  return routine_activity.creatorId === userId
  
 } catch(error){
throw error
 }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
