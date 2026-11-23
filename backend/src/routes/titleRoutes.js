const express = require('express');
const controller = require('../controllers/titleController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Publicas (cualquiera puede explorar el catalogo)
router.get('/', controller.list);
router.get('/:id', controller.getOne);

// Protegidas con JWT
router.post('/', verifyToken, controller.create);
router.put('/:id', verifyToken, controller.update);
router.patch('/:id', verifyToken, controller.update);
// Dos middlewares encadenados: primero verifyToken carga req.user, despues
// requireRole('admin') revisa que ese usuario sea admin. Si cualquiera falla,
// el controller.remove ni se llama.
router.delete('/:id', verifyToken, requireRole('admin'), controller.remove);

module.exports = router;
