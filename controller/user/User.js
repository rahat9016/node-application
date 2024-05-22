const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../../model/Auth")

/**
 * Signup
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Promise<void>}
 */
exports.signup = async (req, res) => {
    try {
        // Check if user already exists
        const { phone, email } = req.body;
        const isExitsUser = await User.find({
            $or: [{ phone: phone, }, { email: email }],
        });
        if (isExitsUser.length > 0) {
            // If user already exists, return error
            res.status(400).json({
                message: "User already registered!",
            });
        } else {
            // If user does not exist, create a new user
            const { firstName, lastName, phone, password, email } = req.body;
            const hash_password = bcrypt.hashSync(password, 10);
            const newUserObj = {
                firstName,
                lastName,
                phone,
                password: hash_password,
                email,
                userName: firstName + lastName,
                role: "user",
            };
            const newUser = new User(newUserObj);
            // Save the new user to the database
            newUser.save().then((data) => {
                if (data) {
                    // If user is saved successfully, return success message
                    res.status(201).json({
                        status:201,
                        message: "User created successfully done!",
                    });
                } else {
                    // If user is not saved successfully, return error
                    res.status(400).json({
                        message: "Something went wrong!",
                    });
                }
            });
        }
    } catch (error) {
        if (error)
            // If error occurs, return internal server error
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
    }
};


/**
 * Signing
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Promise<void>}
 */
exports.signing = async (req, res) => {
    try {
        // Get phone, email and password from request body
        const { phone, email, password } = req.body;
        
        // Find user by phone or email
        const exitsUser = await User.findOne({
            $or: [{ phone: phone, }, { email: email }],
        });
        
        // If user exists
        if (exitsUser) {
            // Compare password
            const comparePassword = bcrypt.compareSync(password, exitsUser.password);
            
            // If password is correct
            if (comparePassword) {
                // Generate token
                const token = jwt.sign(
                    {
                      _id: exitsUser._id,
                      role: exitsUser.role,
                    },
                    process.env.SECRET_KEY_OF_SHOP,
                    { algorithm: 'HS256' },
                    {
                      expiresIn: "1d",
                    }
                  );
                
                // If token is generated
                if (token) {
                    // Return token and user data
                    const {_id, firstName, lastName, userName, role, email, number} = exitsUser;
                    res.status(200).json({
                        token: token,
                        user: {
                            _id, userName, firstName, lastName, role, email, number
                        }
                    });
                }
            } else {
                // Return error if password is incorrect
                res.status(400).json({ message: "Password incorrect!" });
            }
        } else {
            console.log( "else", exitsUser );
        }
    } catch (error) {
        // Log error
        console.error(error);
    }
};
