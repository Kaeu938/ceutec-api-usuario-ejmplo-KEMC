// routes/articulos.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const router = express.Router();

// ---------------------------------------------------------------------
// Configuración de subida de imágenes con Multer
// ---------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombreUnico);
  }
});

const filtroImagen = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimeValido = tiposPermitidos.test(file.mimetype);
  if (extValida && mimeValido) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter: filtroImagen,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB máximo
});

// ---------------------------------------------------------------------
// Función auxiliar de validación de campos del artículo
// ---------------------------------------------------------------------
function validarArticulo(body) {
  const errores = [];
  const { CodArticulo, Nombre, PrecioUnidad, UnidadesStock, StockSeguridad } = body;

  if (!CodArticulo || CodArticulo.trim() === '') {
    errores.push('El código del artículo es obligatorio.');
  } else if (CodArticulo.length > 15) {
    errores.push('El código del artículo no puede exceder 15 caracteres.');
  }

  if (!Nombre || Nombre.trim() === '') {
    errores.push('El nombre del artículo es obligatorio.');
  } else if (Nombre.length > 100) {
    errores.push('El nombre no puede exceder 100 caracteres.');
  }

  if (PrecioUnidad === undefined || PrecioUnidad === '' || isNaN(PrecioUnidad) || Number(PrecioUnidad) < 0) {
    errores.push('El precio por unidad debe ser un número mayor o igual a 0.');
  }

  if (UnidadesStock === undefined || UnidadesStock === '' || isNaN(UnidadesStock) || Number(UnidadesStock) < 0 || !Number.isInteger(Number(UnidadesStock))) {
    errores.push('Las unidades en stock deben ser un número entero mayor o igual a 0.');
  }

  if (StockSeguridad === undefined || StockSeguridad === '' || isNaN(StockSeguridad) || Number(StockSeguridad) < 0 || !Number.isInteger(Number(StockSeguridad))) {
    errores.push('El stock de seguridad debe ser un número entero mayor o igual a 0.');
  }

  return errores;
}

// ---------------------------------------------------------------------
// GET /api/articulos  -> Listar todos los artículos
// ---------------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Articulos ORDER BY FechaCreacion DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los artículos.' });
  }
});

// ---------------------------------------------------------------------
// GET /api/articulos/:codArticulo -> Obtener un artículo por PK
// ---------------------------------------------------------------------
router.get('/:codArticulo', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Articulos WHERE CodArticulo = ?',
      [req.params.codArticulo]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el artículo.' });
  }
});

// ---------------------------------------------------------------------
// POST /api/articulos -> Crear un nuevo artículo (incluye imagen)
// ---------------------------------------------------------------------
router.post('/', upload.single('Imagen'), async (req, res) => {
  try {
    const errores = validarArticulo(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: 'Errores de validación', errores });
    }

    const { CodArticulo, Nombre, Descripcion, PrecioUnidad, UnidadesStock, StockSeguridad } = req.body;
    const rutaImagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Verificar que el código no exista (PK)
    const [existentes] = await pool.query(
      'SELECT CodArticulo FROM Articulos WHERE CodArticulo = ?',
      [CodArticulo]
    );
    if (existentes.length > 0) {
      return res.status(409).json({ mensaje: `Ya existe un artículo con el código ${CodArticulo}.` });
    }

    await pool.query(
      `INSERT INTO Articulos
        (CodArticulo, Nombre, Descripcion, PrecioUnidad, UnidadesStock, StockSeguridad, Imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [CodArticulo, Nombre, Descripcion || null, PrecioUnidad, UnidadesStock, StockSeguridad, rutaImagen]
    );

    const [nuevo] = await pool.query('SELECT * FROM Articulos WHERE CodArticulo = ?', [CodArticulo]);

    res.status(201).json({ mensaje: 'Artículo creado exitosamente.', articulo: nuevo[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el artículo.' });
  }
});

module.exports = router;
