/**
 * Controller for all calls to API related to player management.
 */

const playerService = require("../services/playerService");
const landService = require("../services/landService");
const jwt = require("jsonwebtoken");

// Method that authenticate a player (log in)
const authenticatePlayer = async (req, res) => {
    if (typeof req.body.username === 'undefined' || typeof req.body.password === 'undefined') {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' is missing."});
    } else if (req.body.username.length < 8 || req.body.password.length < 8) {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' are less than 8 characters / digits."});
    } else {
        const _id = await playerService.getAuthKey(req.body.username, req.body.password);

        if (_id !== null) {
            const authKey = jwt.sign({
                "username": req.body.username,
                "_id": _id
            }, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");

            return res.status(200).send({"auth_key": authKey});
        } else {
            return res.status(404).send({"error": "Your username and/or password are incorrect."});
        }
    }
}

// Method to create a new player into the system (sign up)
const createPlayer = async (req, res) => {
    if (typeof req.body.username === 'undefined' || typeof req.body.password === 'undefined') {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' is missing."});
    } else if (req.body.username.length < 8 || req.body.password.length < 8) {
        return res.status(400).send({"error": "Fields 'username' and/or 'password' are less than 8 characters / digits."});
    } else {
        if (await playerService.playerExists(req.body.username)) {
            return res.status(400).send({"error": "A player with this username already exists."});
        } else {
            const playerId = await playerService.createPlayer(req.body.username, req.body.password);
            const landId = await landService.createLand();
            await playerService.registerLand(playerId, landId);

            return res.status(200).send({"message": "Sign up correctly."});
        }
    }
}

// Method to show the actual ranking and positions of the game
const ranking = async (req, res) => {
    const query = await playerService.getRanking();

    return res.status(200).send({"ranking": query});
}

// Method to show the current position from the authenticated player
const rankingPlayer = async (req, res) => {
    const query = await playerService.getTopPlayer(req.player._id);

    return res.status(200).send({"top": query});
}

module.exports = {
    authenticatePlayer,
    createPlayer,
    ranking,
    rankingPlayer,
};