const express = require('express');
const { getAllActivities, createActivity, getActivityByName } = require('../db');
const activitiesRouter = express.Router();
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

activitiesRouter.get('/', async (req,res) => {
        const allActivities = await getAllActivities()
        res.send(
            allActivities
        )
   
})

activitiesRouter.post('/', requireUser, async (req, res, next)=>{
    const { name, description = "" } = req.body
    
    try{
        const activityName = await getActivityByName(name)
        if(activityName){
            next({
                name: "ActivityError",
                message: `An activity with name ${name} already exists`})
        } else{
        const activity = await createActivity({name, description})
        if(activity){
            res.send(activity)
        } else {
        next({
            name: "ActivityError",
            message: `Error creating activity`})
        }}
    } catch ({ name, message }){
        next({ name, message });
    }
})

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
