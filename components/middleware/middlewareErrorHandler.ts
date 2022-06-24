import * as logger from "../utils/Logger";
/**
 * Funzione che gestisce le eccezioni e scrive sul file di log
 * @param err identifica l'errore/eccezione della richiesta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export const errorHandler = (err,req,res,next) => { 
    console.log("test");
    //scrittura del file di log
    logger.logInfo("Fine processamento richiesta\n");
    logger.logError(err.stack+"\n");
    res.header("Content-Type", "application/json");
    res.status(500).send({"error": err.message});
}