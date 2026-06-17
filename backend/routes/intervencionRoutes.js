const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  obtenerIntervenciones,
  crearIntervencion,
  eliminarIntervencion,
} = require('../controllers/intervencionController');

router.get('/:mascotaId', authMiddleware, obtenerIntervenciones);
router.post('/:mascotaId', authMiddleware, crearIntervencion);
router.delete('/:id', authMiddleware, eliminarIntervencion);

module.exports = router;