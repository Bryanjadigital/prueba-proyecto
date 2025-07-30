const RecetaModel = require('../models/RecetaModel');


// Función que maneja la solicitud GET para obtener todas las recetas
const obtenerRecetastodas = async (req, res) => {
  try {
    const recetas = await RecetaModel.find();  // Busca todas las recetas en la BD
    res.json(recetas);                         // Devuelve las recetas en formato JSON
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener recetas', error });
  }
};

// Función que maneja la solicitud GET para obtener receta por id
const obtenerReceta = async (req, res) => {
  const { id } = req.params;
  try {
    const receta = await RecetaModel.findById(id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar receta', error });
  }
};

// Función que maneja la solicitud POST para agregar una nueva receta
const agregarReceta = async (req, res) => {
  try {
    const nuevaReceta = new RecetaModel(req.body);
    const recetaGuardada = await nuevaReceta.save();
    res.status(201).json({ mensaje: 'Receta agregada', receta: recetaGuardada });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al agregar receta', error });
  }
};

// Función que maneja la solicitud PUT para actualizar una receta
const actualizarReceta = async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const recetaActualizada = await RecetaModel.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (!recetaActualizada) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json({ mensaje: 'Receta actualizada', receta: recetaActualizada });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar receta', error });
  }
};

// Función que maneja la solicitud DELETE para eliminar una receta
const eliminarReceta = async (req, res) => {
  const { id } = req.params;

  try {
    const recetaEliminada = await RecetaModel.findByIdAndDelete(id);
    if (!recetaEliminada) {
      return res.status(404).json({ mensaje: 'Receta no encontrada' });
    }
    res.json({ mensaje: 'Receta eliminada' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar receta', error });
  }
};

// Exportamos las funciones para que puedan ser utilizadas en otros archivos
module.exports = { obtenerRecetastodas, obtenerReceta, agregarReceta, actualizarReceta, eliminarReceta };