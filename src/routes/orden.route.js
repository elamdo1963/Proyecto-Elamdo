const express = require('express');
const router = express.Router();
const basicAuth = require('express-basic-auth');
const validarInicioAdmin = require('../middleware/validarInicioAdmin.middleware');
const validarProducto = require('../middleware/validarProducto.middleware');
const {obtenerOrdenesPorEmail, crearOrden,obtenerOrden, editarOrden, obtenerOrdenes} = require('../models/orden.model');
const  validarOrden = require('../middleware/validarOrden.middleware');

/**
 * @swagger
 * /orden:
 *  get:
 *      summary: Permite ver el historial de ordenes del usuario que ha iniciado sesion
 *      tags: ['Orden']
 *      responses:
 *          200:
 *              description: Ordenes obtenidas
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/getOrden'
 *          401: 
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.get('/', (req,res)=>{
    res.json(obtenerOrdenesPorEmail(req.auth.user));
});
/**
 * @swagger
 * /orden:
 *  post:
 *      summary: Permite crear una orden, en estado nuevo
 *      tags: [Orden]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/postOrden'
 *      responses:
 *          201:
 *              description: Orden creada exitosamente
 *          400:
 *              description: Orden inválida o ya existe una en estado nuevo
 *          401:
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.post('/',validarOrden,(req,res)=>{
    const ordenRecibida = req.body;
    const ordenesUsuario = obtenerOrdenesPorEmail(req.auth.user);
    let ordenValida = false;
    if(!ordenesUsuario.find(orden=>orden.estado=="Nuevo")){
        crearOrden(ordenRecibida, req.auth.user);
        ordenValida = true;
    }

    ordenValida ? res.json('Orden creada') : res.status(400).json('Ya tienes una orden en estado nuevo');
});
/**
 * @swagger
 * /orden/{idOrden}:
 *  put:
 *      summary: Permite editar una orden, en estado nuevo
 *      tags: [Orden]
 *      parameters:
 *      - in: path
 *        name: idOrden
 *        type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/postOrden'
 *      responses:
 *          200:
 *              description: Orden editada exitosamente
 *          400:
 *              description: Orden inválida o Orden ya confirmada
 *          401:
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.put('/:idOrden',validarOrden,(req,res)=>{
    const ordenEditada = req.body;
    const ordenBuscada = obtenerOrden(req.params.idOrden);
    let ordenValida = false;

    if(ordenBuscada){
        if(ordenBuscada.estado == 'Nuevo'){
            ordenValida = true;
            editarOrden(req.params.idOrden, ordenEditada);
        }
    }

    ordenValida ? res.json('Orden editada') : res.status(400).json('Orden invalida o ya confirmada');

});
/**
 * @swagger
 * /orden/confirmar/tuOrden:
 *  put:
 *      summary: Permite confirmar una orden en estado nuevo
 *      tags: [Orden]
 *      responses:
 *          201:
 *              description: Orden confirmada exitosamente
 *          400:
 *              description: Orden ya confirmada o no existe una orden en estado nuevo
 *          401:
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.put('/confirmar/tuOrden', (req,res)=>{
    const ordenesUsuario = obtenerOrdenesPorEmail(req.auth.user);
    const ordenSinConfirmar = ordenesUsuario.find(orden=>orden.estado == "Nuevo");

    if(ordenSinConfirmar){
        ordenSinConfirmar.estado = "Confirmado";
    };

    ordenSinConfirmar ? res.json('Orden confirmada') : res.status(400).json('Orden ya confirmada o inexistente');

});
/**
 * @swagger
 * /orden/ver/todas:
 *  get:
 *      summary: Permite ver el historial de ordenes del sistema. Solo para administradores
 *      tags: ['Orden']
 *      responses:
 *          200:
 *              description: Ordenes obtenidas
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/getOrden'
 *          401: 
 *              description: Credenciales de administrador no autorizadas (email y/o contraseña)
 */
router.get('/ver/todas',basicAuth({authorizer: validarInicioAdmin}),(req,res)=>{
    res.json(obtenerOrdenes());
});
/**
 * @swagger
 * /orden/actualizarEstado/{idOrden}/{estado}:
 *  put:
 *      summary: Permite a un administrador actualizar el estado de una orden
 *      tags: [Orden]
 *      parameters:
 *      - in: path
 *        name: idOrden
 *        type: integer
 *      - in: path
 *        name: estado
 *        type: string
 *      responses:
 *          200:
 *              description: Orden editada exitosamente
 *          400:
 *              description: La orden no existe o el estado es invalido
 *          401:
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.put('/actualizarEstado/:idOrden/:estado',basicAuth({authorizer: validarInicioAdmin}),(req,res)=>{
    const estadosPosibles = ['Nuevo', 'Confirmado','En preparacion','Enviado','Entregado'];
    const estadoRecibido = req.params.estado;
    const ordenParaActualizar = obtenerOrden(req.params.idOrden);
    let operacionValida = false;
    if(estadosPosibles.find(estado => estado == estadoRecibido) && ordenParaActualizar){
        operacionValida = true;
        ordenParaActualizar.estado = estadoRecibido;
    }

    operacionValida ? res.json('Estado actualizado') : 
    res.status(400).json('La orden no existe o el estado es inválido');

});

/**
 * @swagger
 * tags:
 *  name: 'Orden'
 *  description: Módulo de ordenes/pedidos
 * components:
 *  schemas:
 *      postOrden:
 *          type: object
 *          required:
 *              -productos
 *              -metodoDePago
 *              -direccion
 *          properties:
 *              productos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      required:
 *                          -id
 *                          -cantidad
 *                      properties:
 *                          id:
 *                              type: integer
 *                          cantidad:
 *                              type: integer
 *                              minimum: 1
 *              metodoDePago:
 *                  type: integer
 *              direccion:
 *                  type: string
 *      getOrden:
 *          type: object
 *          required:
 *              -id
 *              -estado
 *              -total
 *              -direccion
 *              -metodoDePago
 *              -productos
 *              -usuario
 *          properties:
 *              id:
 *                  type: integer
 *              estado:
 *                  type: string
 *              total: 
 *                  type: integer
 *                  minimum : 1
 *              direccion:
 *                  type: string
 *              metodo de pago:
 *                  type: string
 *              productos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      required:
 *                          -nombre
 *                          -cantidad
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          cantidad:
 *                              type: integer
 *                              minimum: 1
 *              usuario:
 *                  type: object
 *                  required:
 *                      -nombre
 *                      -celular
 *                      -username
 *                      -email
 *                  properties:
 *                      nombre:
 *                          type: string
 *                      celular:
 *                          type: string
 *                      username:
 *                          type: string
 *                      email: 
 *                          type: string     
 */

module.exports = router;

