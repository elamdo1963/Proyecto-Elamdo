//En todas las rutas primero requiero las librerias en este caso express y express-basic-auth
//Creo la función de la ruta express.router
const express = require('express');
const router = express.Router();
const basicAuth = require('express-basic-auth');
const validarInicioSesionMiddleware = require('../middleware/validarInicioSesion.middleware');

/**
 * @swagger
 * /iniciarsesion:
 *  get:
 *      summary: Inicia sesion y dice si el email y contraseña es correcto
 *      tags: [Usuarios]
 *      responses:
 *          200:
 *              description: Inicio de sesion exitoso
 *              content:
 *                  application/json:
 *                      type: object
 *          401: 
 *              description: email o contraseña incorrectas          
 */
router.get('/',basicAuth({authorizer: validarInicioSesionMiddleware}),(req,res)=>{
    res.json('Has iniciado sesion');  
});

/**
 * @swagger 
 * tags: 
 *  name : 'Usuarios'
 *  description: 'Módulo registro e inicio de sesión'
 */

module.exports = router;
