const express = require('express');
const router = express.Router();
const { obtenerProductos, agregarProducto, productoPorId, editarProducto,borrarProductoPorId} = require ('../models/producto.model'); 
const basicAuth = require('express-basic-auth');
const validarInicioAdmin = require('../middleware/validarInicioAdmin.middleware');
const validarProducto = require('../middleware/validarProducto.middleware');
/**
 * @swagger
 * /menu:
 *  get:
 *      summary: Para ver todos los productos/menu del sistema
 *      tags: ['Menu']
 *      responses:
 *          200:
 *              description: Productos obtenidos exitosamente
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/productoConID'
 *          401: 
 *              description: Credenciales no autorizadas (email y/o contraseña)
 */
router.get('/', (req,res) =>{
    res.json(obtenerProductos());
}); 


//Solo los administradores pueden acceder a las rutas de aquí en adelante (middleware)
/**
 * @swagger
 * /menu:
 *  post:
 *      summary: Permite a un administrador crear un producto nuevo
 *      tags: [Menu]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/producto'
 *      responses:
 *          201:
 *              description: Producto creado
 *              content:
 *                  application/json:
 *                      type: object
 *          400: 
 *              description: Entradas inválidas
 *              content:
 *                  application/json:
 *                      type: object
 *          401: 
 *              description: email o contraseña incorrectas               
 */
router.post('/',basicAuth({authorizer: validarInicioAdmin}),validarProducto,(req,res) => {
    const  {nombre, precio}  = req.body;

    const nuevoProducto = {
        'nombre' : nombre,
        'precio' : precio
    } 
    agregarProducto (nuevoProducto);
    res.json('Producto agregado');       
});
/**
 * @swagger
 * /menu/{idProducto}:
 *  put:
 *      summary: Permite a un administrador editar un producto por medio de su id
 *      tags: [Menu]
 *      parameters:
 *         - in: path
 *           name: idProducto
 *           required: true
 *           type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/producto'
 *      responses:
 *          200:
 *              description: Producto actualizado
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
router.put('/:idProducto',basicAuth({authorizer: validarInicioAdmin}),validarProducto,(req,res) => {

    const {nombre, precio} = req.body;
    const existe = productoPorId(req.params.idProducto);

    if(existe) { 
        editarProducto (req.params.idProducto,nombre,precio);
        res.json ('Producto actualizado'); 
    } else {
        res.status(400).json ('id del producto inválido'); 
    }

})
/**
 * @swagger
 * /menu/{idProducto}:
 *  delete:
 *      summary: Permite a un administrador eliminar un producto por medio de su id
 *      tags: [Menu]
 *      parameters:
 *         - in: path
 *           name: idProducto
 *           required: true
 *           type: integer
 *      responses:
 *          200:
 *              description: Producto eliminado
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
router.delete('/:idProducto',basicAuth({authorizer: validarInicioAdmin}),(req,res)=> {
    
    const productoBuscado = productoPorId (req.params.idProducto);

    if(productoBuscado) {
        borrarProductoPorId(Number.parseInt(req.params.idProducto));
        res.json('Producto eliminado');
    } else {
        res.status(400).json ('Id del producto inválido');
    }
})

/**
 * @swagger
 * tags:
 *  name: 'Menu'
 *  description: Módulo de productos/menu
 * components:
 *  schemas:
 *      productoConID:
 *          type: object
 *          required:
 *              -nombre
 *              -precio
 *              -id
 *          properties:
 *              nombre:
 *                  type: string
 *              precio: 
 *                  type: integer
 *                  minimum: 1
 *              id: 
 *                  type: integer
  *      producto:
 *          type: object
 *          required:
 *              -nombre
 *              -precio
 *          properties:
 *              nombre:
 *                  type: string
 *              precio: 
 *                  type: integer
 *                  minimum: 1
 */

module.exports = router;


