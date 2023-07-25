const router = require("express").Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
} = require("../../controllers/thought-controller.js");

// /api/thought
router.route("/").get(getAllThoughts).post(createThought);

// /api/thought/:id
router.route("/:id").get(getThoughtsById).put(updateThought).delete(deleteThought);

// /api/thought/:id/reactions
router.route("/:id/reactions").post(createReaction);

// /api/thought/:id/reactions/:reactionId
router.route("/:id/reactions/:reactionId").delete(deleteReaction);

module.exports = router;