import * as logger from "../utils/logger";
import { sendErrorMessage } from "../utils/sendResponses";
/**
 * Funzione che gestisce le eccezioni e scrive sul file di log
 * @param err identifica l'errore/eccezione della richiesta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export const errorHandler = (err,req,res,next) => { 
    //scrittura del file di log
    logger.logInfo("Fine processamento richiesta - Error");
    logger.logError(err.stack);
    res.message = err.message;
    if(res.status_code == null){
        res.status_code = 401;
        res.status_message = "Unauthorized";
    }
    sendErrorMessage(res);
}