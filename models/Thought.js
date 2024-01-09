const { Schema, model } = require('mongoose');
const reactionSchema = require('./reaction.js');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        length: {type: Number, min: 1, max: 280}
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
        get: (date) => date.toLocaleDateString()
    },
    username: {
        type: String,
        required: true
    }, 
    // I hate this specifically.
    reactions: [reactionSchema]
}, 
{ toJSON: { virtuals: true }});

thoughtSchema.virtual('reactionCount').get(function () { return this.reactions.length });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;