let id = 4;

const productos = [
    {
        'id': 1,
        'nombre': 'Pasta Napolitana',
        'precio' : 15000 
    },
    {
        'id': 2,
        'nombre': 'Pasta al pesto',
        'precio' : 16500 
    }, 
    {
        'id': 3,
        'nombre': 'Pasta carbonara',
        'precio' : 13000 
    }
]; 

const obtenerProductos = () => {
    return productos;
};

const agregarProducto = (producto) => {
    producto.id = id;
    id++;
    productos.push (producto);
}

const productoPorId = (id) => {
    return productos.find(producto => producto.id == id);
}; 

const editarProducto = (id, nombre, precio) => {

    const producto = productoPorId(id);

    if(producto){
        producto.nombre = nombre;
        producto.precio = precio;
    }
}; 

const borrarProductoPorId = (id) => {

    const producto = productoPorId(id);

    if(producto){
        productos.splice(productos.indexOf(producto),1);
    }
};

module.exports = {obtenerProductos, agregarProducto, productoPorId, editarProducto,borrarProductoPorId}; 