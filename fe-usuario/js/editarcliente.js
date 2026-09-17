import {obtenerCliente, editarCliente } from './API.js';
import { mostrarAlerta, autenticado } from './funciones.js';

(function() {
    if(autenticado()) {
    const radios = document.querySelectorAll('input[name="estado"]');
    const usuarioInput = document.querySelector('#usuario');
    const passwordInput = document.querySelector('#password');
    const idInput = document.querySelector('#id');

    document.addEventListener('DOMContentLoaded', async () => {
        // Verificar si el cliente existe
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parseInt( parametrosURL.get('id') );
        
        const cliente = await obtenerCliente(idCliente)
        mostrarCliente(cliente);
       console.log(cliente);
        // registra el formulario
        const formulario = document.querySelector('#formulario');
        formulario.addEventListener('submit', validarCliente);
       
    });

    function mostrarCliente(cliente) {
        const { idemp, usuario, clave, estado} = cliente;
        
        radios.forEach(radio => {
        if (radio.value === estado) {
            radio.checked = true;
            }
        });

        usuarioInput.value = usuario;
        passwordInput.value = clave;
        idInput.value = idemp;
    }


    async function validarCliente(e) {
        e.preventDefault();
        const estadoInput = document.querySelector('input[name="estado"]:checked').value;
        const cliente = {
            estado: parseInt(estadoInput), 
            usuario: usuarioInput.value, 
            clave: passwordInput.value,
            idemp: parseInt(idInput.value)
        }
       
        if( validar(cliente) ) {
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }

        await editarCliente(cliente);
        window.location.href = 'index.html';
    }


    function validar(obj) {
        return !Object.values(obj).every(element => element !== '') ;
    }
} else {
    window.location = 'login.html'
}
})();