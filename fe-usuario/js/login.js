
import {login } from './API.js';
import { mostrarAlerta } from './funciones.js';


(function() {

  const formulario = document.querySelector('#formulario');
  formulario.addEventListener('submit', validarCliente);


  async function validarCliente(e) {
    e.preventDefault();
    const usuario = document.querySelector('#usuario').value;
    const password = document.querySelector('#password').value;

    const objUsuario = { 
      usuario, 
      password
    }

    if( validar(objUsuario) ) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }
    localStorage.removeItem('usuario')
    const objU = await login(objUsuario);
    
    if(objU) {
      localStorage.setItem('usuario', objU);
      window.location = 'index.html'
    } else {
      localStorage.removeItem('usuario')
      window.location = 'login.html'
    } 

  }

  


  function validar(obj) {
    return !Object.values(obj).every(element => element !== '') ;
}

})();

