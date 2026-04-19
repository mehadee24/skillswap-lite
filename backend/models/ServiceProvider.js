const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    projectsCompleted: {
        type: Number,
        default: 0
    },
    currentlyWorkingOn: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    profileImage: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);