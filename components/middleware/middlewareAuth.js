require('dotenv').config();
const logger = require('../utils/Logger');
const jwt = require('jsonwebtoken');


const requestTime = (req,res,next) =>{
    req.requestTime = Date.now();
    logger.logInfo("Inizio processamento richiesta\n");
    next();
};


const checkHeader = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        next();
    } else {
        let err = new Error("no auth header");
        next(err);
    }
};

const verifyAndAuthenticate = (req,res,next) => {
    console.log(req.token);
    console.log(process.env.SECRET_KEY)
    let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
    console.log(decoded);
    if(decoded !== null){
        req.user = decoded;
        logger.logInfo("Fine processamento richiesta\n");
        next();
    }
    next(decoded);
};


const checkToken = (req,res,next) => {
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.status(403).send({"error": "Non autorizzato"});
    }
};

module.exports = {
    checkHeader: checkHeader,
    checkToken: checkToken,
    verifyAndAuthenticate: verifyAndAuthenticate,
    requestTime: requestTime
};