var jwt = require('jsonwebtoken');
const JWT_SECRET = "thisisavery";

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send({
            error: "Please authenticate using a valid token"
        });
    }

    try {
        // Remove 'Bearer ' from the token string
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const data = jwt.verify(tokenWithoutBearer, JWT_SECRET);
        req.user = data.user;
        next(); // Call next to proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).send({
            error: "Please authenticate using a valid token"
        });
    }
};

module.exports = fetchUser;
