const PORT = process.env.PORT;

const swaggerConfig = {
    definition : {
        openapi : "3.0.0",
        info : {
            tittle : "Restaurante Delilah API",
            version : "1.0.0",
            description : "API del restaurante Delilah",
            contact : {
                name : "Isabella de ProTalento",
                email : "isazuluocampo@gmai.com"
            }
        },
        servers : [
            {
                url : `http://localhost:${PORT}`,
                description : "Servidor de prueba"
            }
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {
                basicAuth: []
            }
        ]
        
    },
    apis: ["../src/routes/*.js"]

}

module.exports = swaggerConfig;
