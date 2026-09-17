// script.js
// Validación de campos e integración con el endpoint POST /api/articulos

// Cambie esta constante si el backend corre en otro host/puerto
const URL_API = 'http://localhost:3000/api/articulos';

const form = document.getElementById('formArticulo');
const btnGuardar = document.getElementById('btnGuardar');
const mensajeServidor = document.getElementById('mensajeServidor');

const campos = {
  codArticulo: document.getElementById('codArticulo'),
  nombre: document.getElementById('nombre'),
  descripcion: document.getElementById('descripcion'),
  precio: document.getElementById('precio'),
  unidadesStock: document.getElementById('unidadesStock'),
  stockSeguridad: document.getElementById('stockSeguridad'),
  imagen: document.getElementById('imagen')
};

const errores = {
  codArticulo: document.getElementById('errorCodArticulo'),
  nombre: document.getElementById('errorNombre'),
  descripcion: document.getElementById('errorDescripcion'),
  precio: document.getElementById('errorPrecio'),
  unidadesStock: document.getElementById('errorUnidadesStock'),
  stockSeguridad: document.getElementById('errorStockSeguridad'),
  imagen: document.getElementById('errorImagen')
};

const previewImagen = document.getElementById('previewImagen');

// -----------------------------------------------------------------------
// Vista previa de la imagen seleccionada
// -----------------------------------------------------------------------
campos.imagen.addEventListener('change', () => {
  const archivo = campos.imagen.files[0];
  if (!archivo) {
    previewImagen.hidden = true;
    return;
  }
  const lector = new FileReader();
  lector.onload = (e) => {
    previewImagen.src = e.target.result;
    previewImagen.hidden = false;
  };
  lector.readAsDataURL(archivo);
});

// -----------------------------------------------------------------------
// Funciones de validación individuales
// -----------------------------------------------------------------------
function marcarError(campo, span, mensaje) {
  campo.classList.add('invalido');
  span.textContent = mensaje;
}

function limpiarError(campo, span) {
  campo.classList.remove('invalido');
  span.textContent = '';
}

function validarCodArticulo() {
  const valor = campos.codArticulo.value.trim();
  if (valor === '') {
    marcarError(campos.codArticulo, errores.codArticulo, 'El código es obligatorio.');
    return false;
  }
  if (valor.length > 15) {
    marcarError(campos.codArticulo, errores.codArticulo, 'Máximo 15 caracteres.');
    return false;
  }
  if (!/^[A-Za-z0-9\-_]+$/.test(valor)) {
    marcarError(campos.codArticulo, errores.codArticulo, 'Solo letras, números, guiones y guion bajo.');
    return false;
  }
  limpiarError(campos.codArticulo, errores.codArticulo);
  return true;
}

function validarNombre() {
  const valor = campos.nombre.value.trim();
  if (valor === '') {
    marcarError(campos.nombre, errores.nombre, 'El nombre es obligatorio.');
    return false;
  }
  if (valor.length > 100) {
    marcarError(campos.nombre, errores.nombre, 'Máximo 100 caracteres.');
    return false;
  }
  limpiarError(campos.nombre, errores.nombre);
  return true;
}

function validarDescripcion() {
  const valor = campos.descripcion.value.trim();
  if (valor.length > 255) {
    marcarError(campos.descripcion, errores.descripcion, 'Máximo 255 caracteres.');
    return false;
  }
  limpiarError(campos.descripcion, errores.descripcion);
  return true;
}

function validarPrecio() {
  const valor = campos.precio.value;
  if (valor === '' || isNaN(valor)) {
    marcarError(campos.precio, errores.precio, 'Ingrese un precio válido.');
    return false;
  }
  if (Number(valor) < 0) {
    marcarError(campos.precio, errores.precio, 'El precio no puede ser negativo.');
    return false;
  }
  limpiarError(campos.precio, errores.precio);
  return true;
}

function validarUnidadesStock() {
  const valor = campos.unidadesStock.value;
  if (valor === '' || isNaN(valor) || !Number.isInteger(Number(valor))) {
    marcarError(campos.unidadesStock, errores.unidadesStock, 'Ingrese un número entero.');
    return false;
  }
  if (Number(valor) < 0) {
    marcarError(campos.unidadesStock, errores.unidadesStock, 'No puede ser negativo.');
    return false;
  }
  limpiarError(campos.unidadesStock, errores.unidadesStock);
  return true;
}

function validarStockSeguridad() {
  const valor = campos.stockSeguridad.value;
  if (valor === '' || isNaN(valor) || !Number.isInteger(Number(valor))) {
    marcarError(campos.stockSeguridad, errores.stockSeguridad, 'Ingrese un número entero.');
    return false;
  }
  if (Number(valor) < 0) {
    marcarError(campos.stockSeguridad, errores.stockSeguridad, 'No puede ser negativo.');
    return false;
  }
  limpiarError(campos.stockSeguridad, errores.stockSeguridad);
  return true;
}

function validarImagen() {
  const archivo = campos.imagen.files[0];
  if (!archivo) {
    limpiarError(campos.imagen, errores.imagen);
    return true; // La imagen es opcional
  }
  const tiposValidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!tiposValidos.includes(archivo.type)) {
    marcarError(campos.imagen, errores.imagen, 'Formato no soportado (use jpg, png, gif o webp).');
    return false;
  }
  const tamanoMaximo = 2 * 1024 * 1024; // 2 MB
  if (archivo.size > tamanoMaximo) {
    marcarError(campos.imagen, errores.imagen, 'La imagen no debe superar 2 MB.');
    return false;
  }
  limpiarError(campos.imagen, errores.imagen);
  return true;
}

// Validación en tiempo real
campos.codArticulo.addEventListener('input', validarCodArticulo);
campos.nombre.addEventListener('input', validarNombre);
campos.descripcion.addEventListener('input', validarDescripcion);
campos.precio.addEventListener('input', validarPrecio);
campos.unidadesStock.addEventListener('input', validarUnidadesStock);
campos.stockSeguridad.addEventListener('input', validarStockSeguridad);
campos.imagen.addEventListener('change', validarImagen);

function validarFormularioCompleto() {
  const resultados = [
    validarCodArticulo(),
    validarNombre(),
    validarDescripcion(),
    validarPrecio(),
    validarUnidadesStock(),
    validarStockSeguridad(),
    validarImagen()
  ];
  return resultados.every(Boolean);
}

// -----------------------------------------------------------------------
// Mostrar mensajes de resultado
// -----------------------------------------------------------------------
function mostrarMensaje(texto, tipo) {
  mensajeServidor.textContent = texto;
  mensajeServidor.className = `mensaje-servidor ${tipo}`;
  mensajeServidor.hidden = false;
}

// -----------------------------------------------------------------------
// Envío del formulario -> POST /api/articulos
// -----------------------------------------------------------------------
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeServidor.hidden = true;

  if (!validarFormularioCompleto()) {
    mostrarMensaje('Corrija los errores marcados en el formulario antes de continuar.', 'fallo');
    return;
  }

  const datosFormulario = new FormData();
  datosFormulario.append('CodArticulo', campos.codArticulo.value.trim());
  datosFormulario.append('Nombre', campos.nombre.value.trim());
  datosFormulario.append('Descripcion', campos.descripcion.value.trim());
  datosFormulario.append('PrecioUnidad', campos.precio.value);
  datosFormulario.append('UnidadesStock', campos.unidadesStock.value);
  datosFormulario.append('StockSeguridad', campos.stockSeguridad.value);
  if (campos.imagen.files[0]) {
    datosFormulario.append('Imagen', campos.imagen.files[0]);
  }

  btnGuardar.disabled = true;
  btnGuardar.textContent = 'Guardando...';

  try {
    const respuesta = await fetch(URL_API, {
      method: 'POST',
      body: datosFormulario
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      const detalle = resultado.errores ? resultado.errores.join(' ') : (resultado.mensaje || 'Error desconocido.');
      mostrarMensaje(detalle, 'fallo');
    } else {
      mostrarMensaje(resultado.mensaje || 'Artículo creado exitosamente.', 'exito');
      form.reset();
      previewImagen.hidden = true;
    }
  } catch (error) {
    console.error(error);
    mostrarMensaje('No fue posible conectar con el servidor. Verifique que el backend esté en ejecución.', 'fallo');
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = 'Guardar artículo';
  }
});

// Limpiar mensajes al usar "Limpiar"
form.addEventListener('reset', () => {
  Object.keys(campos).forEach((clave) => {
    limpiarError(campos[clave], errores[clave]);
  });
  previewImagen.hidden = true;
  mensajeServidor.hidden = true;
});
