const validarProducto = (req, res, next) => {

    const { nombre, precio } = req.body;
    let entradasValidas = false;
    if (nombre && precio) {
        entradasValidas = true;
    }
    
    entradasValidas ? next() : res.status(400).json('Producto inválido');
    
}

module.exports = validarProducto;
