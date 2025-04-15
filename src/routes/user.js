const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectonRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user")

const userData = "firstName lastName photoUrl skills about";

// To get all the opending connections requests of the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
    const loggedInUser = req.user;
     
    const connectionRequests = await ConnectonRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
    }).populate("fromUserId", userData);


res.json({
    message: "Data fetched successfully!!",
    data: connectionRequests,
});
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectonRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },

            ],
        }).populate("fromUserId", userData)
          .populate("toUserId", userData);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
             return row.fromUserId
         })
         res.json({data: data});

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async (req,res) => {
    try {

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;


        const connectionRequests = await ConnectonRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
            {_id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } },
            ],
        }).select(userData).skip(skip).limit(limit);

      res.send(users);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = userRouter;
