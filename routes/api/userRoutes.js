const router = require('express').Router();
const { User, Thought } = require('../../models/index.js');

router.route('/').get(async (req, res) => { 
// Finds all possible users
    try {
        const users = await User.find({});
        res.json( {userList: users, message: "All users shown."} );
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
}).post(async (req, res) => { try {
// Creates a new user
        const user = await User.create(req.body);
        res.json( {createdUser: user, message: "User has been created."} );
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

router.route('/:userId').get(async (req, res) => { 
// Finds a user by their specific id
    try {
        const user = await User.findOne({ _id: req.params.userId }).select('-__v');
        if (!user) { return res.status(404).json({ message: "No user with that ID. Please try another one." }); }
        res.json( {message: "Found a user.", foundUser: user});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err); 
    }
}).put(async (req, res) => { 
// Updates a specific user
    try {
        const user = await User.findOneAndUpdate( 
            { _id: req.params.userId }, 
            { $set: req.body }, 
            { runValidators: true, new: true } 
        );
        if (!user) { res.status(404).json({ message: 'No user with this id. Please try another one.' }); }
        res.json({updatedUser: user, message: "Updated chosen user, altered ObjectId."});
        } catch (err) { 
            console.log(err);
            res.status(500).json(err); 
        }
}).delete(async (req, res) => {
// Delete a specific user
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) { res.status(404).json({ message: 'No user with that ID. Please try another one.' }); }
        res.json({message: 'Chosen user has been deleted.'});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err);
    }
});

router.route('/:userId/friends/:friendId').post(async (req, res) => { 
// Add a new friend
    try {
        const friend = await User.findOne({ _id: req.params.friendId }).select('__v');
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: friend._id } }, 
            { runValidators: true, new: true }
        );
        res.json({friendList: user.friends, message: "Added user's ID to friend list."});
    } catch (err) { 
        console.log(err);
        res.status(500).json(err); 
    }
}).delete(async (req, res) => {
// Delete a current friend
    try {
        const friend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runVaildators: true, new: true }
        );

        console.log(friend.friends);
        res.json( {friendList: friend, message: "Chosen friend's ID removed."} );
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;