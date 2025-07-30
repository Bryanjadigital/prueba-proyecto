//aqui se importa las dependencias
const express = require('express');
const router = express.Router();

// aqui se importa el controlador de recetas
const RecetasController = require('../controllers/recetasController');

//aqui se configura las rutas del crud
router.get('/', RecetasController.obtenerRecetastodas);    // GET obtener todas las recetas
router.get('/:id', RecetasController.obtenerReceta);      // GET obtener receta por ID
router.post('/', RecetasController.agregarReceta);      // POST crear nueva receta
router.put('/:id', RecetasController.actualizarReceta);   // PUT actualizar receta
router.delete('/:id', RecetasController.eliminarReceta); // DELETE eliminar receta

//aqui se exporta la ruta para que pueda ser utilizada en otras partes
module.exports = router;