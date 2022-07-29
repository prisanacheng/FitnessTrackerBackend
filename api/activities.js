const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  updateActivity,
  getActivityById,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const activities = await getPublicRoutinesByActivity({ id: activityId });

    if (activities.length === 0) {
      next({
        name: "ActivityDoesNotExistError",
        message: `Activity ${activityId} not found`,
      });
    } else res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.get("/", async (req, res) => {
  const allActivities = await getAllActivities();
  res.send(allActivities);
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  try {
    const activityName = await getActivityByName(name);
    if (activityName) {
      next({
        name: "ActivityError",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const activity = await createActivity({ name, description });
      if (activity) {
        res.send(activity);
      } else {
        next({
          name: "ActivityError",
          message: `Error creating activity`,
        });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const updateFields = { id: activityId };
  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }
  try {
    const originalActivity = await getActivityById(activityId);
    if (!originalActivity) {
      next({
        name: "ActivityUpdateError",
        message: `Activity ${activityId} not found`,
      });
    } else {
      const ActivityName = await getActivityByName(name);
      if (ActivityName) {
        next({
          name: "ActivityUpdateError",
          message: `An activity with name ${name} already exists`,
        });
      } else {
        const updatedActivity = await updateActivity(updateFields);
        if (updatedActivity) {
          res.send(updatedActivity);
        } else {
          next({
            name: "ActivityUpdateError",
            message: `Error updating activity`,
          });
        }
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = activitiesRouter;
