// Cargar variables de entorno desde el archivo .env
require('dotenv').config();  

//aqui se importa las dependencias
const express = require('express');
const cors = require ('cors')
const mongoose = require('mongoose');
const recetasRoutes = require('./routes/recetasRoutes');
const recetaModel = require('./models/recetaModel.js');
const app = express();
const path = require('path');

// Middleware para parseo y cors
app.use(express.json());  // Parsear JSON
app.use(cors());  // Habilitar CORS
app.use(express.static(path.join(__dirname, 'public')));
app.use('/html', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Ruta raíz
app.get('/', (req, res) => {
   res.send('Servidor funcionando');
 });

// Rutas API
app.use('/api/recetas', recetasRoutes);

// Middleware para manejo de errores (puede ir antes del catch-all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


// Conexión a MongoDB (config/db.js)
// Conexión a MongoDB usando la variable de entorno MONGO_URI
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((error) => console.error("Error al conectar con MongoDB:", error));

// Iniciar servidor
// Usar el puerto del archivo .env o el puerto por defecto (5000) si no está definido
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}/`);
  console.log(`Rutas disponibles: http://localhost:${PORT}/api/recetas`);
});