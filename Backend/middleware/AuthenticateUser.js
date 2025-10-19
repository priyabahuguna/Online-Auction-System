const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = "your_jwt_secret";

const authenticateUser = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authorization token not provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        const user = await User.findOne({ _id: decoded.user.id });

        if (!user) {
            throw new Error();
        }

        // Attach user object to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticateUser;
