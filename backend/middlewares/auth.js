/**
 * Middleware to check the authorization of the API calls using the Json Web Token.
 */

const jwt = require('jsonwebtoken');

// Method that checks if exists the bearer header and validates the given access token.
const isAuthorized = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        try {
            req.player = jwt.verify(bearerToken, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
            next();
        } catch (error) {
            res.status(400).json({"error": "Incorrect API key."})
        }
    }
}

module.exports = {
    isAuthorized,
};