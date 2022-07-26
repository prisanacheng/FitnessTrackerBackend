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
    console.log (routine_activity, "thisi is a routine_activity")
   return routine_activity  
   }catch (error){
     console.error(error)
   }
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
