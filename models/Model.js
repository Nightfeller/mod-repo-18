const { Schema, model, Types } = require('mongoose');

function makeFormattedDate() {
    const date = new Date(Date.now());
    const formatDate = date.toLocaleDateString();
    return formatDate;
}

const reactionSchema = new Schema ({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        get: makeFormattedDate
    }
});

const thoughtSchema = new Schema({
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        }, createdAt: {
            date: Date,
            default: Date.now(),
            get: makeFormattedDate
        },
        username: {
            type: String,
            required: true
        }, reactions: reactionSchema 
    }, 
    { toJSON: { virtuals: true }});

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: function(value) {
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            },
            message: 'Invalid email address',
        },
        thoughts: [Thought],
        friends: [this.userSchema]
    },
    { toJSON: { virtuals: true } });

userSchema.virtual('friendCount').get(function () { return this.friends.length });
userSchema.virtual('reactionCount').get(function () { return this.reactions.length });

const Thought = model('thought', thoughtSchema);
const User = model('user', userSchema);

module.exports = { User, Thought };