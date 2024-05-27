const User = require("../model/User");

exports.signup = async (req, res) => {
    const { fullName, email, phone, password, role } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ fullName, email, phone, password, role });
        await user.save();
        
        res.status(201).json({
            status: 201,
            message: "User created successfully",});
    } catch (error) {
        
    }
}

exports.signing = async (req, res) => {
    res.send("signing")
}