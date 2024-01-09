const { User, Thought } = require('../models/index.js');
const connection = require('../config/connection');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await User.create([{
        username: 'Nightlight',
        email: 'neurolicLI@yahoo.com',
        thoughts: [],
        friends: []
    }, {
        username: 'JoeEEE',
        email: 'doeybotoy@gmail.com',
        thoughts: [],
        friends: []
    }, {
        username: 'snsa',
        email: 'skele1@gmail.com',
        thoughts: [],
        friends: []
    }]);
});