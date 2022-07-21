//Import delle classi e moduli
import * as UserClass from "../modelsDB/User";
import * as AstaClass from "../modelsDB/Asta";
import * as PartecipazioneClass from "../modelsDB/Partecipazione";
import * as formatRequestValidator from "../utils/formatRequestValidator"
import * as PuntataClass from "../modelsDB/Puntata"
import * as logger from "../utils/logger";
import { ErrorMsgEnum } from "../msgResponse/ErrorMsg";
import { User } from "../modelsDB/User";
const { Op } = require("sequelize");


/**
 * Funzione asincrona per validare la richiesta di inserimento dell'asta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function insertBidVal (req:any,res:any,next:any){
    try{
        req.body.username_creator = req.user;
        if(formatRequestValidator.validateRawDataAsta(req.body)){
            let responseVal = await AstaClass.validatorInsertAsta(req.body);
            responseVal === true ? next() : next(responseVal)
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona per validare la richiesta di partecipazione ad un'asta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function partecipaAstaVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(!formatRequestValidator.validateRawDataPartecipazione(req.body))
            next(ErrorMsgEnum.BadFormattedData)
        else{
            let responseVal = await PartecipazioneClass.validatorInsertPartecipazione(req.body);
            responseVal === true ? next() : next(responseVal)
        } 
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che valida la puntata effettuata durante l'asta
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function puntataVal(req:any,res:any,next:any)  {
    try{
        req.body.username = req.user;
        if(formatRequestValidator.validateRawDataPartecipazione(req.body)){
            let responseVal = await PuntataClass.validatorInsertPuntata(req.body);
            responseVal === true ? next() : next(responseVal)
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che effettua la validazione della ricarica da utente ADMIN a "Giocatore"
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function ricaricaUtenteVal(req:any,res:any,next:any)  {
    try{
        req.body.username_admin = req.user;
        if(formatRequestValidator.validateRawDataRicaricaCredito(req.body)){
            let responseVal = await UserClass.validatorRicaricaUtente(req.body);
            responseVal === true ? next() : next(responseVal)
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che valida la richiesta di controllo del credito residuo 
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function verificaCreditoResiduoVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(typeof req.body.username == "string"){
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            user ? next() : next(ErrorMsgEnum.UtenteNonEsiste)
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che valida l'elenco dei rilanci effettuati
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function elencoRilanciVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(formatRequestValidator.validateRawDataElencoRilanci(req.body)){
            let responseVal = await PuntataClass.visualizzaElencoRilanciVal(req);
            if(typeof responseVal !== "number"){
                res.data = {"rilanci": responseVal};
                next();
            } else{
                next(responseVal)
            }
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che valida la visualizzazione delle aste per stato (creata, aperta, rilancio, terminata)
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function visualizzaAsteByStatoVal(req:any,res:any,next:any) {
    try{
        formatRequestValidator.validateRawDataAstFilter(req.query) ? next() : next(ErrorMsgEnum.BadFormattedData)
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che effettua la validazione sullo storico delle aste (visualizza tutte le aste effettuate in un 
 * determinato periodo temporale)
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function storicoAsteVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(typeof req.body.username === "string"){
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            user ? next() : next(ErrorMsgEnum.NoPermessi)
        }else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che effettua la validazione sulle spese effettuate durante tutte le partecipazioni (storico)
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function speseEffettuateVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(formatRequestValidator.validateRawTimeStampFilter(req.body)){
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            user ? next() : next(ErrorMsgEnum.NoPermessi) 
        }
        else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};
/**
 * Funzione asincrona che valida le statistiche dell'asta secondo il numero di partecipazioni
 * @param req identifica la richiesta
 * @param res identifica la risposta
 * @param next passa al prossimo middleware
 */
export async function statsVal(req:any,res:any,next:any) {
    try{
        req.body.username = req.user;
        if(formatRequestValidator.validateRawTimeStampFilter(req.body)){
            const user = await UserClass.userIsAdmin(req.body.username).then((user) => { 
                return user;
            });
            user ? next() : next(ErrorMsgEnum.NoPermessi);
        }
        else{
            next(ErrorMsgEnum.BadFormattedData)
        }
    }catch(error){
        logger.logError(error.stack)
        next(ErrorMsgEnum.ServerErrorInternal)
    }
};