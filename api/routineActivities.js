const express = require('express');
const router = express.Router();
const {
    destroyRoutineActivity,
    getRoutineActivityById,
    updateRoutineActivity,
    getRoutineById
  } = require("../db");
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { duration, count } = req.body;
    const reqId = req.params.routineActivityId
    const origRoutineActivity = await getRoutineActivityById(reqId);
    const neededRoutine = await getRoutineById(origRoutineActivity.routineId)
    const routineId = origRoutineActivity.routineId
    const activityId = origRoutineActivity.activityId
    const id = origRoutineActivity.id
    try {
      if (req.user.id !== neededRoutine.creatorId) {
        res.status(403)
        next({
        name: "RoutineActivityUpdateError",
        message: `User ${req.user.username} is not allowed to update ${neededRoutine.name}`,
        }) 
      } 
        const updatedRoutineActivity = await updateRoutineActivity({id, routineId, activityId, duration, count})
        res.send(updatedRoutineActivity);
        
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId
    
    try {
      const routineAct = await getRoutineActivityById(id);
      const neededRoutine = await getRoutineById(routineAct.routineId)
      if (neededRoutine.creatorId != req.user.id) {
       res.status(403)  
        next({ 
            name: "UnauthorizedUserError",
            message: `User ${req.user.username} is not allowed to delete ${neededRoutine.name}`,
          });
      } else {
        await destroyRoutineActivity(routineAct.id);
        res.send(routineAct);
      }
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = router;
