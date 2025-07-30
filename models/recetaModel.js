//aqui se importa las dependencias
const mongoose = require('mongoose');

//aqui se crea el esquema de la base de datos para la receta
const RecetaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { 
    type: String, 
    required: true,
    enum: ['desayuno', 'almuerzo', 'cena']
  },
  ingredientes: { type: [String], required: true },
  instrucciones: { type: String, required: true },
  tiempo_preparacion: { type: Number, required: true },
  imagen: { type: String, default: 'default.jpg' }
});

//aqui se exporta la ruta para que pueda ser utilizada en otras partes
module.exports = mongoose.models.RecetaModel || mongoose.model('RecetaModel', RecetaSchema);