const { Schema, model } = require('mongoose');

function valid (val) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val);
}
const emailValidator = [valid, 'Invalid email address'];

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
            validate: emailValidator
        },
        thoughts: [{type: Schema.Types.ObjectId, ref: 'thought'}],
        friends: [{type: Schema.Types.ObjectId, ref: 'user'}]
    },
    { toJSON: { virtuals: true } });

userSchema.virtual('friendCount').get(function () { return this.friends.length });

const User = model('user', userSchema);

module.exports = User;