const validarMetodoPago = (req, res, next) => {

    const { nombre } = req.body;

    nombre ? next() : res.status(400).json('Método de pago inválido');
    
}

module.exports = validarMetodoPago;
