const router = require('express').Router();
const { User, Thought } = require('../../models/index.js');

router.route('/').get(async (req, res) => {
// Finds all possible thoughts
    try {
        const thoughts = await Thought.find();
        res.json({thoughtList: thoughts, message: "All thoughts shown."});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
}).post(async (req, res) => {
// Creates a new thought for a chosen user
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            {_id: req.body.userId},
            { $push: { thoughts: thought._id } }, 
            { runValidators: true, new: true }
        );
        res.json({createdThought: thought, UserOfThought: user, message: "Thought has been created and pushed onto chosen user."});
    } catch (err) {
        console.log(err);
        res.status(500).json(err); 
    }
});

router.route('/:thoughtId').get(async (req, res) => {
// Finds a thought be its specific id
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
        if (!thought) { return res.status(404).json({ message: 'No thoughts with that ID. Please try another one.' }); }
        res.json({message: "Found a thought.", foundThought: thought});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err); 
    }
}).put(async (req, res) => {
// Updates a specific thought
    try {
        const thought = await Thought.findOneAndUpdate( 
            { _id: req.params.thoughtId }, 
            { $set: req.body }, 
            { runValidators: true, new: true } 
        );
        if (!thought) { res.status(404).json({ message: 'No thoughts with this id. Please try another one.' }); }
    res.json({updatedThought: thought, message: "Updated chosen thought, altered ObjectId."});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err); 
    }
}).delete(async (req, res) => {
// Delete a specific user
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) { res.status(404).json({ message: 'No thought with that ID. Please try another one.' }); }
        res.json({message: 'Chosent thought deleted.'});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
});

router.route('/:thoughtId/reactions/').post(async (req, res) => {
// Add a reaction to a chosen thought
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { runValidators: true, new: true },
        );
        res.json({message: "Reaction added to chosen thought.", reactionList: thought.reactions, thoughtChosen: thought});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}).delete(async (req, res) => {
// Delete a specific reaction from the chosen thought
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {reactionId: req.body.reactionId } } },
            { runVaildators: true, new: true }
        );

        res.json({message: 'Chosen reaction removed from thought.', reactionList: reaction.reactions, thought: reaction});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;