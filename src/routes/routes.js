const { Router } = require('express');
const router = Router();

const auth = require('../middlewares/auth');
const playerController = require("../controllers/playerController");
const landController = require("../controllers/landController");

// PLAYERS ENDPOINTS
router.post('/players/login', playerController.authenticatePlayer);
router.post('/players', playerController.createPlayer);
router.get('/ranking/top', auth.isAuthorized, playerController.ranking);
router.get('/ranking', auth.isAuthorized, playerController.rankingPlayer);

// LAND ENDPOINTS
router.get('/lands', auth.isAuthorized, landController.getLands);
router.post('/lands', auth.isAuthorized, landController.createLand);
router.get('/lands/:land_id', auth.isAuthorized, landController.getLandInfo);
router.post('/lands/building', auth.isAuthorized, landController.buildOrUpgrade);
router.post('/lands/resource', auth.isAuthorized, landController.upgradeResource);
router.post('/lands/pyramid', auth.isAuthorized, landController.upgradePyramid);
router.post('/lands/troops', auth.isAuthorized, landController.recruitTroops);
router.post('/lands/adventure', auth.isAuthorized, landController.adventure);


module.exports = router;