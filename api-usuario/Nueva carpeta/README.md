# CCC217: Análisis de problemas — Registro de Artículos

Formulario (HTML/CSS/JS) con validación de campos integrado al endpoint **POST** de creación
de artículos, construido sobre la API de la actividad 7.2.

## Estructura del proyecto

```
actividad/
├── backend/
│   ├── server.js            # Servidor Express
│   ├── db.js                # Conexión a MySQL (pool)
│   ├── package.json
│   ├── routes/
│   │   └── articulos.js     # GET, GET/:id, POST /api/articulos
│   └── uploads/              # Imágenes subidas (se crea automáticamente)
├── frontend/
│   ├── index.html            # Formulario de ingreso
│   ├── style.css
│   └── script.js             # Validaciones + fetch POST
├── database/
│   └── script_bd.sql         # Script de creación de la BD y tabla Articulos
└── README.md
```

## Campos del formulario (tabla Articulos)

| Campo            | Columna         | Validación                                   |
|-------------------|-----------------|-----------------------------------------------|
| Código artículo   | CodArticulo (PK)| Obligatorio, máx. 15 caracteres, alfanumérico |
| Nombre            | Nombre          | Obligatorio, máx. 100 caracteres              |
| Descripción       | Descripcion     | Opcional, máx. 255 caracteres                 |
| Precio/unidad     | PrecioUnidad    | Obligatorio, numérico, >= 0                   |
| Unidades en stock | UnidadesStock   | Obligatorio, entero, >= 0                     |
| Stock de seguridad| StockSeguridad  | Obligatorio, entero, >= 0                     |
| Imagen            | Imagen          | Opcional, jpg/png/gif/webp, máx. 2 MB          |

## Instalación y ejecución

### 1. Base de datos

Ejecute el script en su gestor MySQL:

```bash
mysql -u root -p < database/script_bd.sql
```

### 2. Backend

```bash
cd backend
npm install
# Configure credenciales de BD por variables de entorno si difieren de los valores por defecto:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
npm start
```

El servidor levanta en `http://localhost:3000`. El backend también sirve el frontend
directamente en esa misma dirección, por lo que puede abrir `http://localhost:3000`
en el navegador sin necesidad de un servidor adicional.

### 3. Frontend (alternativa independiente)

Si desea servir el frontend por separado, abra `frontend/index.html` con un servidor
estático (por ejemplo, la extensión "Live Server" de VS Code) y asegúrese de que la
constante `URL_API` en `frontend/script.js` apunte a la URL correcta del backend.

## Endpoint utilizado

**POST** `/api/articulos`
Content-Type: `multipart/form-data`

Campos enviados: `CodArticulo`, `Nombre`, `Descripcion`, `PrecioUnidad`,
`UnidadesStock`, `StockSeguridad`, `Imagen` (archivo).

Respuestas:
- `201 Created` → artículo creado exitosamente.
- `400 Bad Request` → errores de validación.
- `409 Conflict` → el código de artículo ya existe.
- `500 Internal Server Error` → error inesperado del servidor.
