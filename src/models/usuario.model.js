//Creo el array de usuarios con los datos que necesito
const usuarios = [
    {
        'id': 1,
        'nombre': "Isabella",
        'email': "isazuluocampo@gmail.com",
        'celular': "3178055480",
        'direccion': "Calle 12 # 48a-60",
        'username': "isabellazuluaga",
        'password': "isabella123",
        'isAdmin' : false
    },
    {
        'id': 2,
        'nombre': 'administrador',
        'email': 'admin@gmail.com',
        'celular': '3136419323',
        'direccion': 'Calle 40 # 41a-22',
        'username': "admin",
        'password': '123',
        'isAdmin' : true
    }
];

//Agrego usuario creando una constante (la voy a usar en la ruta) y después una función que indique que lo que ingrese lo mande al array de usuarios
const agregarUsuario = (usuario) => {
    usuarios.push(usuario);
};

//Agrego obtener usuarios, para que el get de la aplicación me arroje los usuarios que tengo
const obtenerUsuarios= () => {
    return usuarios;
};

//Agrego esta constante para validar que no hayan emails repetidos con la función find que me ayuda a filtrar y verificar
const obtenerUsuarioPorEmail = (email) => {
    return usuarios.find(usuario => usuario.email === email);
};

//Debo exportar las funciones que cree para usuarlas en la ruta
module.exports = { agregarUsuario, obtenerUsuarios, obtenerUsuarioPorEmail };

