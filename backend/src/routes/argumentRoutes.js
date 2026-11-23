const express = require('express');
const controller = require('../controllers/argumentController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Esta capa solo decide que middleware pasa antes de cada controller
// (publico vs con verifyToken), no tiene logica propia.

// Publica (cualquiera puede leer los argumentos de un debate)
router.get('/', controller.list);

// Protegidas con JWT
router.post('/', verifyToken, controller.create);
router.post('/:id/vote', verifyToken, controller.vote);

module.exports = router;
