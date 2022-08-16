const jwt = require('jsonwebtoken');

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