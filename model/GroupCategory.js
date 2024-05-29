const mongoose = require('mongoose');

const GroupCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    is_active: {
      type: Boolean,
      default: true  
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('GroupCategory', GroupCategorySchema);
