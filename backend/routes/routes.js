const { Router } = require('express');
const router = Router();

const auth = require('../middlewares/auth');
const playerController = require("../controllers/playerController");
const landController = require("../controllers/landController");
const adminController = require("../controllers/adminController");

// PLAYERS ENDPOINTS
router.post('/api/players/login', playerController.authenticatePlayer);
router.post('/api/players', playerController.createPlayer);
router.get('/api/ranking/top', auth.isAuthorized, playerController.ranking);
router.get('/api/ranking', auth.isAuthorized, playerController.rankingPlayer);

// ADMIN ENDPOINTS
router.post('/api/admin/resource', auth.isAuthorized, adminController.addResource);
router.post('/api/admin/building', auth.isAuthorized, adminController.addBuilding);
router.post('/api/admin/troop', auth.isAuthorized, adminController.addTroop);
router.post('/api/admin/adventure', auth.isAuthorized, adminController.addAdventure);

// LAND ENDPOINTS
router.get('/api/gamemaster', landController.getGamemaster);
router.get('/api/lands', auth.isAuthorized, landController.getLands);
router.post('/api/lands', auth.isAuthorized, landController.createLand);
router.get('/api/lands/:land_id', auth.isAuthorized, landController.getLandInfo);
router.post('/api/lands/building', auth.isAuthorized, landController.buildOrUpgrade);
router.post('/api/lands/resource', auth.isAuthorized, landController.upgradeResource);
router.post('/api/lands/pyramid', auth.isAuthorized, landController.upgradePyramid);
router.post('/api/lands/troops', auth.isAuthorized, landController.recruitTroops);
router.post('/api/lands/adventure', auth.isAuthorized, landController.adventure);

module.exports = router;