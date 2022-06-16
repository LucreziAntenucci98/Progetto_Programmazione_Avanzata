//import library
const express = require('express');
const auth = require('./components/middleware/middlewareAuth');
const logger = require('./components/utils/Logger')
const {checkHeader, 
       checkToken, 
       verifyAndAuthenticate,
       requestTime} = require('./components/middleware/middlewareAuth');
const {logError,
       errorHandler} = require('./components/middleware/middlewareErrorHandler');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();


app.use([
        requestTime,
        checkHeader,
        checkToken,
        verifyAndAuthenticate,
        logError,
        errorHandler
        ]);

//rotta autenticata esempio
app.get('/', (req, res) => {
    res.json({messaggio:"test"});
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);