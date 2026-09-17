import { nuevoCliente } from './API.js';
import { mostrarAlerta, autenticado } from './funciones.js';

(function() {
    if(autenticado()) {
        const formulario = document.querySelector('#formulario');
        formulario.addEventListener('submit', validarCliente);
    
        async function validarCliente(e) {
            e.preventDefault();
    
            const idemp = document.querySelector('#idemp').value;
            const usuario = document.querySelector('#usuario').value;
            const clave = document.querySelector('#password').value;
            const estado = document.querySelector('input[name="estado"]:checked').value;
    
            const cliente = {
                idemp, 
                usuario, 
                clave,
                estado
            }
    
            if( validar(cliente) ) {
                mostrarAlerta('Todos los campos son obligatorios');
                return;
            }
            await nuevoCliente(cliente);
            window.location.href = 'index.html';
        }
    
        function validar(obj) {
            return !Object.values(obj).every(element => element !== '') ;
        }
    } else {
        window.location = 'login.html';
    }


})();