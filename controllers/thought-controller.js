const { Thought, User } = require("../models");

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .sort({_id: -1 })
            .then((dbThoughtsData) => res.json(dbThoughtsData))
            .catch((err) => {
                res.status(400).json(err);
            });
    },
    // Get thoughts by id
    getThoughtsById({ params }, res) {
        Thought.findOne({_id: params.id })
            .then((dbThoughtsData) => {
                if (!dbThoughtsData) {
                    res.status(404).json({ message: "No thought found by that id." });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },
    // Post to create thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({_id}) => {
                console.log(_id);
                return User.findOneAndUpdate(
                    {_id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbThoughtsData) => {
                console.log(dbThoughtsData);
                if (!dbThoughtsData) {
                    res.status(404).json({ message: "No user found with that id."});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch((err) => res.json(err));
    },
    // Put to update thought by id
    updateThought({ params, body}, res) {
        console.log(params.thoughtId);
        console.log(body);
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbThoughtsData) => {
                if (!dbThoughtsData) {
                    res.status(404).json({ message: "No thought found with this id." });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch((err) => res.status(400).json(err));
    },
    // Delete thought by id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((deletedThought) => {
                if (!deletedThought) {
                    return res.status(404).json({ message: "No thought found with this id." });
                }
                console.log(deletedThought);
                User.findOneAndUpdate(
                    { username: deletedThought.username },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                ).then((dbThoughtsData) => {
                    if (!dbThoughtsData) {
                        res.status(404).json({ message: "No user found with this id." });
                        return;
                    }
                    res.json(dbThoughtsData);
                });
            })
            .catch((err) => res.json(err));
    },
    // Post to create reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then((dbThoughtsData) => {
                if (!dbThoughtsData) {
                    res.status(404).json({ message: "No user found with this id." });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch((err) => res.json(err));
    },
    // Delete to pull and delete reaction by reactionId
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then((dbThoughtsData) => res.json(dbThoughtsData))
            .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;