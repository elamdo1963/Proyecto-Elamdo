const express = require('express');
const router = express.Router();
const {agregarUsuario, obtenerUsuarios} = require('../models/usuario.model');
const validarUnirte = require('../middleware/validarUnirte.middleware');

/**
 * @swagger
 * /unirte:
 *  post:
 *      summary: Crea un nuevo usuario
 *      tags: [Usuarios]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/usuario'
 *      responses:
 *          201:
 *              description: Usuario creado
 *              content:
 *                  application/json:
 *                      type: object
 *          400: 
 *              description: Entradas inválidas
 *              content:
 *                  application/json:
 *                      type: object             
 */


router.post('/', validarUnirte, (req, res) => {

    const { nombre, email, celular, direccion, username, password } = req.body;

    const nuevoUsuario = 
    {
        'nombre': nombre,
        'email': email,
        'celular': celular,
        'direccion': direccion,
        'username': username,
        'password': password,
        'isAdmin' : false
    }

    agregarUsuario(nuevoUsuario);
    res.status(201).json("Usuario agregado");

});

router.get('/',(req,res)=>{
    res.json(obtenerUsuarios());
})


/**
 * @swagger 
 * tags: 
 *  name : 'Usuarios'
 *  description: 'Módulo registro e inicio de sesión'
 * 
 * components: 
 *  schemas:
 *      usuario: 
 *          type: object
 *          required:
 *               -username
 *               -nombre
 *               -celular
 *               -email
 *               -direccion
 *               -password
 *          properties: 
 *              username:
 *                  type: string
 *              nombre:
 *                  type: string
 *              celular:
 *                  type: string
 *              email:
 *                  type: string
 *              direccion:
 *                  type: string
 *              password:
 *                  type: string 
 */
module.exports = router;

