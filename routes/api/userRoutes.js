const router = require('express').Router();
const { User, Thought } = require('../../models/index.js');

router.route('/').get(async (req, res) => { 
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
}).post(async (req, res) => { try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

router.route('/:userId').get(async (req, res) => { try {
        const user = await User.findOne({ _id: req.params.userId }).select('-__v');
        if (!user) { return res.status(404).json({ message: 'No user with that ID' }); }
        res.json(user);
    } catch (err) { res.status(500).json(err); }
}).put(async (req, res) => { try {
        const user = await User.findOneAndUpdate( 
            { _id: req.params.userId }, 
            { $set: req.body }, 
            { runValidators: true, new: true } 
        );
        if (!user) { res.status(404).json({ message: 'No user with this id!' }); }
        res.json(user);
        } catch (err) { res.status(500).json(err); }
}).delete(async (req, res) => { try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) { res.status(404).json({ message: 'No user with that ID' }); }
        await Student.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and thoughts deleted.' });
    } catch (err) { res.status(500).json(err); }
});

router.route('/:userId/friends/:friendId').post(async (req, res) => { try {
    const friend = await User.findOne({ _id: req.params.friendId }).select('-__v');
    if (!friend) { return res.status(404).json({ message: 'No friend with that ID' }); }
    res.json(friend);
    } catch (err) { res.status(500).json(err); }
}).delete(async (req, res) => { try {
    const friend = await User.findOneAndDelete({ _id: req.params.userId });
    if (!friend) { res.status(404).json({ message: 'No friend with that ID' }); }
    res.json({ message: 'Friend remvoed.' });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;