const {productoPorId} = require('../models/producto.model');
const {obtenerUsuarioPorEmail} = require('../models/usuario.model');
const {obtenerMetodoDePago, obtenerMetodosDePago} = require('../models/metodospago.model');
let id = 1;

const ordenes = [];

const obtenerOrdenes = () => {
    return ordenes;
};

const obtenerOrdenesPorEmail = (email) => {
    return ordenes.filter(orden => orden.usuario.email == email);
}

const obtenerOrden = (id)=>{
    return ordenes.find(orden => orden.id == id);
}

const crearOrden = (orden, correoUsuario) =>{
    const productosRecibidos = orden.productos;
    const usuarioBuscado = obtenerUsuarioPorEmail(correoUsuario);
    const metodoCompleto = obtenerMetodoDePago(orden.metodoDePago);
    const usuarioCompleto = {
        "nombre": usuarioBuscado.nombre,
        "celular": usuarioBuscado.celular,
        "username": usuarioBuscado.username,
        "email" : usuarioBuscado.email
    };
    const nuevaOrden = {
        "id" : id,
        "estado" : "Nuevo",
        "total" : 0,
        "direccion": orden.direccion,
        "metodoDePago": metodoCompleto.nombre,
        "productos" : [],
        "usuario" : usuarioCompleto
    }
    completarProductos(nuevaOrden, productosRecibidos);
    ordenes.push(nuevaOrden);

    id++;
};

const editarOrden = (id, ordenEditada)=>{
    const ordenBuscada =ordenPorId(id);
    const metodoDePago = obtenerMetodoDePago(ordenEditada.metodoDePago);
    ordenBuscada.metodoDePago = metodoDePago.nombre;
    ordenBuscada.direccion = ordenEditada.direccion;
    completarProductos(ordenBuscada,ordenEditada.productos);
};

const ordenPorId = (id)=>{
    return ordenes.find(orden => orden.id == id);
}

const completarProductos = (orden,productosRecibidos) =>{
    const productosCompletos = [];
    let total = 0;
    for(let i=0;i<productosRecibidos.length;i++){
        const productoRecibido = productosRecibidos[i];
        const productoBuscado = productoPorId(productoRecibido.id);
        const productoCompleto = {
            "nombre":productoBuscado.nombre,
            "cantidad": productoRecibido.cantidad
        }
        productosCompletos.push(productoCompleto);
        total += productoBuscado.precio * productoRecibido.cantidad;
    };

    orden.productos = productosCompletos;
    orden.total = total;
}

module.exports = {obtenerOrdenesPorEmail, obtenerOrdenes,crearOrden,editarOrden,obtenerOrden};