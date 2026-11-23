const express = require('express');
const controller = require('../controllers/debateController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Publicas (cualquiera puede explorar los debates)
router.get('/', controller.list);
router.get('/:id', controller.getOne);

// Protegidas con JWT
router.post('/', verifyToken, controller.create);
router.patch('/:id/close', verifyToken, controller.close);

module.exports = router;
