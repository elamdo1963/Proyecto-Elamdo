const express = require('express');
const router = express.Router();
const basicAuth = require('express-basic-auth');
const validarAdmin = require('../middleware/validarInicioAdmin.middleware');
const validarMetodoPago = require('../middleware/validarMetodoPago.middleware');
const { obtenerMetodosDePago, agregarMetodoDePago, obtenerMetodoDePago, editarMetodoDePago, borrarMetodoDePago } = require('../models/metodospago.model');

/**
 * @swagger
 * /pago:
 *  get:
 *      summary: Muestra todos los métodos de pago que existen
 *      tags: [Pago]
 *      responses:
 *          200: 
 *              description: Metodo de pago obtenidos 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/metodoConId'
 *          401:
 *              description: Email o contraseña de admin no autorizados
 *                          
 */
router.get('/', basicAuth({ authorizer: validarAdmin }), (req, res) => {
    res.json(obtenerMetodosDePago());
});
/**
 * @swagger
 * /pago:
 *  post:
 *      summary: Permite crear un nuevo metodo de pago
 *      tags: [Pago]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/metodoSinId'
 *      responses:
 *          201: 
 *              description: Metodo de pago creado
 *              content:
 *                  application/json:
 *                      type: object                    
 *          401:
 *              description: Email o contraseña de admin no autorizados
 *                          
 */
router.post('/', basicAuth({ authorizer: validarAdmin }), validarMetodoPago, (req, res) => {
    const { nombre } = req.body;
    const nuevoMetodoPago = {
        'nombre': nombre,
    }
    agregarMetodoDePago(nuevoMetodoPago);
    res.json('Método de pago agregado');
});
/**
 * @swagger
 * /pago/{idMetodo}:
 *  put:
 *      summary: Permite editar un metodo de pago por medio de su id
 *      tags: [Pago]
 *      parameters:
 *         - in: path
 *           name: idMetodo
 *           required: true
 *           type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/metodoSinId'
 *      responses:
 *          200:
 *              description: Metodo actualizado
 *              content:
 *                  application/json:
 *                      type: object
 *          400: 
 *              description: Entradas inválidas o id inválido
 *              content:
 *                  application/json:
 *                      type: object
 *          401: 
 *              description: email o contraseña incorrectas               
 */
router.put('/:idMetodo',basicAuth({ authorizer: validarAdmin }), validarMetodoPago, (req, res) => {
    const {nombre} = req.body; 
    const metodoPagoBuscado = obtenerMetodoDePago(req.params.idMetodo);
    if (metodoPagoBuscado) {
        editarMetodoDePago(req.params.idMetodo, nombre);
        res.json('Metodo de pago actualizado');
    } else {
        res.status(400).json('El metodo de pago no existe');
    }
});
/**
 * @swagger
 * /pago/{idMetodo}:
 *  delete:
 *      summary: Permite a un administrador eliminar un metodo de pago por medio de su id
 *      tags: [Pago]
 *      parameters:
 *         - in: path
 *           name: idMetodo
 *           required: true
 *           type: integer
 *      responses:
 *          200:
 *              description: Metodo eliminado
 *              content:
 *                  application/json:
 *                      type: object
 *          400: 
 *              description: id inválido
 *              content:
 *                  application/json:
 *                      type: object
 *          401: 
 *              description: email o contraseña incorrectas               
 */
router.delete('/:idMetodo',basicAuth({ authorizer: validarAdmin }),(req, res) => {
    const metodoPagoBuscado = obtenerMetodoDePago(req.params.idMetodo);
    if (metodoPagoBuscado) {
        borrarMetodoDePago(Number.parseInt(req.params.idMetodo));
        res.json('Metodo de pago eliminado');
    } else {
        res.status(400).json('El metodo de pago no existe');
    }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Pago
 *  description: Módulo de pagos
 * components:
 *  schemas:
 *      metodoConId:
 *          type: object
 *          required:
 *              -nombre
 *              -id
 *          properties:
 *              id: 
 *                  type: integer
 *              nombre:
 *                  type: string
 *      metodoSinId:
 *          type: object
 *          required:
 *              -nombre
 *          properties:
 *              nombre:
 *                  type: string
 */