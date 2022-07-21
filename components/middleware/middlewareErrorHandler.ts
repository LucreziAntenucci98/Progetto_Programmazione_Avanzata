import { ErrorMsgEnum, getErrorMsg } from "../msgResponse/ErrorMsg";
import { Msg } from "../msgResponse/Msg";
import * as logger from "../utils/logger";
/**
 * Funzione che gestisce le eccezioni e scrive sul file di log
 * @param err identifica l'errore/eccezione della richiesta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 */
export function errorHandler(err: any, req: any, res: any, next: any){ 
    //scrittura del file di log
    if(err.status === 400)
        return res.status(err.status).send('JSON non valido');
    logger.logInfo("Fine processamento richiesta - Error");
    const err_msg:Msg = getErrorMsg(err);
    res.header("Content-Type", "application/json");
    res.status(err_msg.getMsg().getStatusCode()).json(err_msg.getMsg());
}
