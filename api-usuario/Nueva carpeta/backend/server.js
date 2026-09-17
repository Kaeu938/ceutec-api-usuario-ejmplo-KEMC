// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const articulosRouter = require('./routes/articulos');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir el frontend (opcional, útil para probar todo junto)
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Rutas de la API
app.use('/api/articulos', articulosRouter);

// Manejo de errores de Multer / generales
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ mensaje: err.message });
  }
  next();
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
