require('dotenv').config();
import { ErrorMsgEnum } from "../msgResponse/ErrorMsg";
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
            next(ErrorMsgEnum.NoAuthHeader);
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal);
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
            next(ErrorMsgEnum.ErroreDiFirma)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal);
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
            if((decoded.role === "admin" || 
                decoded.role === "bid_partecipant" || 
                decoded.role === "bid_creator") &&
                typeof decoded.username === "string"){
                 req.user = decoded.username
                 next()
            } else {
                next(ErrorMsgEnum.NoPermessi)
            }
        }else{
            next(ErrorMsgEnum.ErroreDiFirma)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal);
    }
};

