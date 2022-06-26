require('dotenv').config();
import * as logger from "../utils/logger";
const jwt = require('jsonwebtoken');
/**
 * Funzione che va ad inserire nella richiesta la data e l'ora attuale.
 * @param req richiesta
 * @param res risposta
 * @param next passa al prossimo middleware
 */
export const requestTime = (req,res,next) =>{
    req.requestTime = Date.now();
    logger.logInfo("Inizio processamento richiesta");
    next();
};

/**
 * Funzione che verifica se è presente nell'header il parametro authorization.
 * @param req richiesta
 * @param res risposta
 * @param next passa al prossimo middleware
 */
export const checkHeader = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(authHeader){
            next();
        } else {
            let err = new Error("no auth header");
            next(err);
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica la correttezza del token JWT e decodifica il payload.
 * @param req richiesta
 * @param res risposta
 * @param next passa al prossimo middleware 
 */
export const verifyAndAuthenticate = (req,res,next) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if(decoded !== null){
            req.body = decoded;
            next();
        }else{
            let error = new Error("Signature Error") 
            next(error);
        }
    }catch(error){
        next(error);
    }
};

/**
 * Funzione che verifica se è presente il bearerToken JWT
 * @param req richiesta
 * @param res risposta
 * @param next passa al prossimo middleware
 */
export const checkToken = (req,res,next) => {
    try{
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }else{
            let error = new Error("Signature error") 
            next(error)
        }
    }catch(error){
        next(error);
    }
};