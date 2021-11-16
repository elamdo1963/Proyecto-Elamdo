const basicAuth = require('express-basic-auth'); //Requiero la librería para el login
const { obtenerUsuarios } = require('../models/usuario.model');//Requiero la ruta en donde se encuentran los usuarios

//Creo la función del middleware
const validarInicioSesion = (username, password) => {

    const existe = obtenerUsuarios().find(arrayUsuario => basicAuth.safeCompare(arrayUsuario.email,username) &&
    basicAuth.safeCompare(arrayUsuario.password, password));

    return existe ? true : false;
}

module.exports = validarInicioSesion;
