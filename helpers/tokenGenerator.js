const jwt = require('jsonwebtoken');

exports.generateToken = (phone,id) => {
    return jwt.sign({ phone, id }, process.env.SECURITY_KEY, { expiresIn: '15s' });
};