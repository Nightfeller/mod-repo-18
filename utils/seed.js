const { User, Thought } = require('../models/index.js');
const connection = require('../config/connection');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await Thought.create({
        thoughtText: 'This is my thought!',
        username: 'JoeEEE',
        reactions: [{reactionBody: 'so cool', username: 'snsa'}]
    });

    await User.create([{
        username: 'Nightlight',
        email: 'neurolicLI@yahoo.com',
        thoughts: [],
        friends: ['6594cc11551ef8d3e9cd3b40']
    }, {
        username: 'JoeEEE',
        email: 'doeybotoy@gmail.com',
        thoughts: ['6594cc11551ef8d3e9cd3b39'],
        friends: ['6594cc11551ef8d3e9cd3b3f', '6594cc11551ef8d3e9cd3b41']
    }, {
        username: 'snsa',
        email: 'skele1@gmail.com',
        thoughts: [],
        friends: ['6594cc11551ef8d3e9cd3b40']
    }]);
});