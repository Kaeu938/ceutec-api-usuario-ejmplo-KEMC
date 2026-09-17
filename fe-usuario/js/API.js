const url = "http://127.0.0.1:5000/usuario";

export const nuevoCliente = async cliente => {
    try {
        await fetch(url, {
            method: 'POST', 
            body: JSON.stringify(cliente),
            headers:{
                'Content-Type': 'application/json' 
            },
            mode: "cors"
        });
    } catch (error) {
        console.log(error);
    }
}

export const obtenerClientes = async () => {
    try {
        const resultado = await fetch(url,{
            method: "GET",
            mode: "cors",
        });
        const clientes = await resultado.json();
        return clientes;
    } catch (error) {
        console.log(error);
    }
}


export const login = async (usuario) => {
    try {
        const resultado = await fetch(`${url}/login`, {
            method: 'POST', 
            body: JSON.stringify(usuario), 
            headers:{
                'Content-Type': 'application/json' 
            },
            mode: "cors"
        });
        return resultado.json();
    } catch (error) {
        console.log(error);
    }
}

export const obtenerCliente = async id => {
    try {
        const resultado = await fetch(`${url}/${id}`, {
            method: "GET",
            mode: "cors"});
        const cliente = await resultado.json();
        return cliente;
    } catch (error) {
        console.log(error);
    }
}


export const editarCliente = async cliente => {
    try {
        await fetch(`${url}/${cliente.idemp}`, {
            method: 'PUT', 
            body: JSON.stringify(cliente), 
            headers:{
                'Content-Type': 'application/json' 
            },
            mode: "cors"
        });
    } catch (error) {
        console.log(error);
    }
}

export const eliminarCliente = async id => {
    try {
        await fetch(`${url}/${id}`, {
            method: 'DELETE',
            mode: "cors"
        });
        
    } catch (error) {
        console.log(error);
    }
}