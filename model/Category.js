const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
    },
    groupCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupCategory',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
