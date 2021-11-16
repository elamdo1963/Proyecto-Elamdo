const {productoPorId} = require('../models/producto.model');
const {obtenerMetodoDePago} = require('../models/metodospago.model');

const validarOrden = (req, res, next) => {

    const {productos,direccion,metodoDePago} = req.body;
    let ordenValida = false;
    if(productos && direccion && metodoDePago){
        ordenValida = true;
        for(let i=0; i<productos.length;i++){
            if(!productoPorId(productos[i].id)){
                ordenValida = false;
                break;
            }
        }

        if(!obtenerMetodoDePago(metodoDePago)){
            ordenValida = false;
        }
    }

    ordenValida ? next() : res.status(400).json('Orden inválida');
    
}

module.exports = validarOrden;
