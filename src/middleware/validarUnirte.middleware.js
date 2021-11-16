const { obtenerUsuarios } = require('../models/usuario.model');

const verificarEmail = (email) => {

    const existe = obtenerUsuarios().find(arrayUsuario => arrayUsuario.email === email);

    return existe ? false : true;

};

const validarUnirte = (req, res, next) => {

    const {nombre, celular, email, direccion, username, password}  = req.body;
    let usuarioValido = 0;

    if(nombre && celular && email && direccion && username && password){
        if(verificarEmail(email)){
            usuarioValido = 2;
        }else{
            usuarioValido = 1;
        } 
    }

    switch (usuarioValido) {
        case 0:
            res.status(400).json('Usuario no válido');
            break;
    
        case 1:
            res.status(400).json("Ya existe el email");
            break;
        default:
            next();
            break;
    }

};

module.exports = validarUnirte;
