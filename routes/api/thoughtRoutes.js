const router = require('express').Router();
const { User, Thought } = require('../../models/index.js');

router.route('/').get(async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (err) { res.status(500).json(err); }
}).post(async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = thought.userId;
        user.push(thought);
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
    
}).delete(async (req, res) => {
    
});

module.exports = router;