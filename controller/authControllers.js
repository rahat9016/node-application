const { generateToken } = require("../helpers/tokenGenerator");
const User = require("../model/User");

exports.signup = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ fullName, email, phone, password, role });
        await user.save();

        res.status(201).json({
            status: 201,
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

exports.signing = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { phone }] });
        // check user found or not
        if(!user) return res.status(404).json({
            status: 404,
            message:"This User not found!"
        })
        // check password
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ 
                status:400,
                errors: {
                    password:'Invalid password'
                }
             });
        }
         res.status(200).json({
            status:200,
            user:{
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,                
            },
            token: generateToken(user.phone,user._id)
            

        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Something went wrong!"
        })
    }
}

exports.logout = (req,res)=> {
    return res.status(200).json({
        status: 200,
        message: "Successfully logged out"
    })
}