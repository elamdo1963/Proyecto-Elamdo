require('dotenv').config();

const PORT = process.env.PORT;
const express = require ('express');
const basicAuth = require ('express-basic-auth'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerConfig = require('./swagger/swaggerConfig');
const swaggerSpecs = swaggerJsDoc(swaggerConfig);

const app = express ();

app.use(express.json()); 

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

const unirteRoute = require('./routes/unirte.route');
const iniciarSesionRoute = require('./routes/iniciarSesion.route'); 
const validarInicioSesionMiddleware = require('./middleware/validarInicioSesion.middleware');
const menuRoute = require('./routes/menu.route');
const pagoRoute = require('./routes/pago.route');  
const ordenRoute = require('./routes/orden.route');

app.use('/unirte', unirteRoute);
app.use('/iniciarsesion', iniciarSesionRoute);
app.use (basicAuth({authorizer: validarInicioSesionMiddleware}));
app.use('/menu', menuRoute);
app.use('/pago', pagoRoute);
app.use('/orden', ordenRoute);

app.listen (PORT,() => console.log(`Servidor iniciado en el puerto ${PORT}`)); 