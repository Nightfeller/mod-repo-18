const router = require('express').Router();
const { User, Thought } = require('../../models/index.js');

router.route('/').get(async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
}).post(async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            {_id: req.body.userId},
            { $push: { thoughts: thought._id } }, 
            { runValidators: true, new: true }
        );
        console.log(req.body.userId);
        console.log(user);
        res.json(thought);
    } catch (err) { 
        const thought = await Thought.create(req.body);
        console.log(thought);
        console.log(err);
        res.status(500).json(err); 
    }
});

router.route('/:thoughtId').get(async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');
        if (!thought) { return res.status(404).json({ message: 'No thoughts with that ID' }); }
        res.json(thought);
    } catch (err) { res.status(500).json(err); }
}).put(async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate( 
            { _id: req.params.thoughtId }, 
            { $set: req.body }, 
            { runValidators: true, new: true } 
        );
        if (!thought) { res.status(404).json({ message: 'No thoughts with this id!' }); }
    res.json(thought);
    } catch (err) { 
        console.log(err);
        res.status(500).json(err); 
    }
}).delete(async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) { res.status(404).json({ message: 'No thought with that ID' }); }
        res.json({ message: 'Thought deleted.' });
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
});

router.route('/:thoughtId/reactions/').post(async (req, res) => {
    try {
        // const reaction = Thought.findOne({ _id: req.params.thoughtId }).select('__v');
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { runValidators: true, new: true },
        );
        console.log(req.params.thoughtId);
        console.log(req.body);
        res.json(thought.reactions);
    } catch (err) {
        const reaction = await Thought.findOne({ _id: req.params.thoughtId }).select('__v');
        console.log(req.body);
        console.log(reaction);
        console.log('-----------------------------------------');
        console.log(err);
        res.status(500).json(err);
    }
}).delete(async (req, res) => {
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {reactionId: req.body.reactionId } } },
            { runVaildators: true, new: true }
        );

        console.log(reaction.reactions);
        res.json({ message: 'Reaction removed.' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;