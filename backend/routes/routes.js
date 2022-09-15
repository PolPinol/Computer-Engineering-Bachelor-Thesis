const { Router } = require('express');
const router = Router();

const auth = require('../middlewares/auth');
const playerController = require("../controllers/playerController");
const landController = require("../controllers/landController");

// PLAYERS ENDPOINTS
router.post('/api/players/login', playerController.authenticatePlayer);
router.post('/api/players', playerController.createPlayer);
router.get('/api/ranking/top', auth.isAuthorized, playerController.ranking);
router.get('/api/ranking', auth.isAuthorized, playerController.rankingPlayer);

// LAND ENDPOINTS
router.get('/api/lands', auth.isAuthorized, landController.getLands);
router.post('/api/lands', auth.isAuthorized, landController.createLand);
router.get('/api/lands/:land_id', auth.isAuthorized, landController.getLandInfo);
router.post('/api/lands/building', auth.isAuthorized, landController.buildOrUpgrade);
router.post('/api/lands/resource', auth.isAuthorized, landController.upgradeResource);
router.post('/api/lands/pyramid', auth.isAuthorized, landController.upgradePyramid);
router.post('/api/lands/troops', auth.isAuthorized, landController.recruitTroops);
router.post('/api/lands/adventure', auth.isAuthorized, landController.adventure);

module.exports = router;