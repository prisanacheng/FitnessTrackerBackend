const express = require('express');
const { getAllActivities, createActivity, getActivityByName, getActivityById } = require('../db');
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
activitiesRouter.patch('/:activityId', requireUser,  async (req,res,next)=>{
    const { activityId } = req.params
    const { name, description } = req.body

    const updateFields = {}

   
    if(name){
        updateFields.name = name
    }

    if(description){
        updateFields.description = description
    }

    try{
        const originalActivity = await getActivityById(activityId)
        console.log(originalActivity, "og activityyyyyy")
        if(originalActivity.author.id === req.user.id){
            const updatedPost = await updatePost(postId, updateFields)
            res.send({post: updatedPost})
        } else {
            next({
                name: "UnauthorizedUserError",
                message: "you cannot update a post that is not yours"
            })
        }
    } catch({name, message}){
        next({name, message})
    }
})

module.exports = activitiesRouter;
