
let id = 3;

const metodosDePago = [
    {
        'id': 1,
        'nombre': 'efectivo'
    },
    {
        'id': 2,
        'nombre': 'debito',
    }, 
]

const obtenerMetodosDePago= () => {
    return metodosDePago; 
}; 

const agregarMetodoDePago = (metodoPago) => {
    metodoPago.id = id;
    id++;
    metodosDePago.push (metodoPago);
};


const obtenerMetodoDePago = (id) => {
    return metodosDePago.find(metodoPago => metodoPago.id == id);
}; 

const editarMetodoDePago = (id, nombre) => {

    const metodoPago = obtenerMetodoDePago(id);

    if(metodoPago){
        metodoPago.nombre = nombre;
    }
}; 

const borrarMetodoDePago = (id) => {

    const metodoPago = obtenerMetodoDePago(id);

    if(metodoPago){
        metodosDePago.splice(metodosDePago.indexOf(metodoPago),1);
    }
};


module.exports = {obtenerMetodosDePago, agregarMetodoDePago, obtenerMetodoDePago, editarMetodoDePago, borrarMetodoDePago}; 




