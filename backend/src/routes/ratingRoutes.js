const express = require('express');
const controller = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Publica (cualquiera puede ver el promedio de un titulo)
router.get('/', controller.summary);

// Protegida con JWT
router.post('/', verifyToken, controller.create);

module.exports = router;
