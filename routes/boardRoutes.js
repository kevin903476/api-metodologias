//@ts-check
const express = require('express');
const router = express.Router();
const pizarraController = require('../controllers/boardController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/pizarras', pizarraController.getAllPizarras);
router.get('/pizarras/:id', pizarraController.getPizarraById);
router.post('/pizarras', pizarraController.createPizarra);

router.get('/pizarras/:pizarraId/tarjetas', pizarraController.getTarjetasByPizarra);
router.post('/pizarra/cards', pizarraController.addCardToPizarra);
router.delete('/pizarra/cards/:cardId', pizarraController.removeCardFromPizarra);

module.exports = router;