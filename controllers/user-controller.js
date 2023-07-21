const { User } = require("../models");

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find({})
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Get single user by id and populated thought/friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
            .select("-__v")
            .populate({
                path: "friends",
            })
            .populate({
                path: "thoughts",
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with that id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // Post to create new user
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(400).json(err));
    },
    // Put to update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with that id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },
    // Delete user by id
    deleteUser({ params }, res) {
        User.findByIdAndDelete({ _id: params.userId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with that id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },
    // Post to add new friend to user's friend list
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }._id,
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with that id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    // Delete friend from user's friend list
    deleteFriend({ params }, res) {
        console.log("delete friend", params.friendId);
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((dbUserData) => res.json(dbUserData));
            .catch((err) => res.json(err));
    },
};

module.exports = userController;