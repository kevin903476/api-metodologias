//@ts-check
const express = require('express');
const router = express.Router();
const forumsController = require('../controllers/forumsController');

// GET /forums - Obtener todos los foros
router.get('/forums', forumsController.getAllForums);

// GET /forums/:id - Buscar foro por ID
router.get('/forums/:id', forumsController.getForumById);

// POST /forums - Crear un nuevo foro
router.post('/forums', forumsController.createForum);

// PUT /forums/:id - Actualizar un foro
router.put('/forums/:id', forumsController.updateForum);

// DELETE /forums/:id - Eliminar un foro
router.delete('/forums/:id', forumsController.deleteForum);

module.exports = router;