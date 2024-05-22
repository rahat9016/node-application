const mongoose = require("mongoose")


const userSchema = new  mongoose.Schema({
    userName:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        min:2,
        max: 25,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        min:2,
        max: 25,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: String,
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    zone: {
        type: String,
        trim: true
    },
    role:{
        type: String,
        required: true,
        trim: true,
        enum: ["admin", "user", "projectManager"],
        default: "user"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)