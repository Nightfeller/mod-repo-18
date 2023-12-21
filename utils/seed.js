const { User, Thought } = require('../models/Model.js');
const connection = require('../config/connection');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    
});