//Import delle classi e moduli
import * as UserClass from "../models/User";
import * as AstaClass from "../models/Asta";
import * as PartecipazioneClass from "../models/Partecipazione";
import * as formatRequestValidator from "../utils/formatRequestValidator"
import * as PuntataClass from "../models/Puntata"


/**
 * Funzione asincrona per validare la richiesta di inserimento dell'asta
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function insertBidVal (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataAsta(req.body))
            errorResp = new Error("Errore di formattazione del payload")
        else{
            errorResp = await AstaClass.validatorInsertAsta(req.body);
            if(!(errorResp instanceof Error)){
                await AstaClass.Asta.create(req.body).then(() =>{
                    res.message = "Asta creata";
                    res.status_code = 200;
                    res.status_message = "OK";
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione asincrona per validare la richiesta di partecipazione ad un'asta
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function partecipaAstaVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataPartecipazione(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            errorResp = await PartecipazioneClass.validatorInsertPartecipazione(req.body);
            if(!(errorResp instanceof Error)){
                const asta = await AstaClass.Asta.findByPk(req.body.id_asta,{raw:true}).then((result:any) => {
                    return result;
                });
                const quota_partecipazione = asta.quota_partecipazione;
                req.body.spesa_partecipazione = quota_partecipazione;
                await PartecipazioneClass.Partecipazione.create(req.body).then(() =>{
                    res.message = "Iscrizione all'asta avvenuta con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione asincrona che valida la puntata effettuata durante l'asta
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function puntataVal(req:any,res:any,next:any)  {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataPartecipazione(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            errorResp = await PuntataClass.validatorInsertPuntata(req.body);
            if(!(errorResp instanceof Error)){
                
                let partecipazione = await PartecipazioneClass.Partecipazione.findAll({where:
                    {id_asta: req.body.id_asta,
                     username:req.body.username},
                }).then((partecipazione:any)=>{
                    return partecipazione;
                });

                req.body.id_partecipazione = partecipazione[0].id_partecipazione;
                
                await PartecipazioneClass.Partecipazione.increment(
                    ['contatore_puntate'],
                    {
                     by: 1,
                     where:{
                        id_asta: req.body.id_asta,
                        username: req.body.username
                     }
                });

                await PuntataClass.Puntata.create(req.body).then(() =>{
                    res.message = "Rilancio avvenuto con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione asincrona che effettua la validazione da utente ADMIN a "Giocatore"
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function ricaricaUtenteVal(req:any,res:any,next:any)  {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataRicaricaCredito(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            errorResp = await UserClass.validatorRicaricaUtente(req.body); 
            if(!(errorResp instanceof Error)){
                res.message = "Ricarica Utente avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                next();
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione asincrona che valida la richiesta di controllo del credito residuo 
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function verificaCreditoResiduoVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(typeof req.body.username != "string") 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            if(user){
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"credito": user.credito};
                next();
            }
            else{
                errorResp = new Error("L'utente non è un bid_partecipant o non esiste");  
            }
        } 
        if(errorResp instanceof Error)
            next(errorResp);
    }catch(error){
        next(error);
    }
    
};
/**
 * Funzione asincrona che valida l'elenco dei rilanci effettuati
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function elencoRilanciVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataElencoRilanci(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            let response = await PuntataClass.visualizzaElencoRilanciVal(req);
            if(response instanceof Error){
                errorResp = response;
            } else{
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"rilanci": response};
                next();
            }
        }
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione asincrona che valida la visualizzazione delle aste per stato (creata, aperta, rilancio, terminata)
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function visualizzaAsteByStatoVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawDataAstFilter(req.query)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            await AstaClass.Asta.findAll({where:
                {stato: req.query.stato},raw:true}).then((aste:any) =>{
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"elenco_aste": aste};
                next();
            });
        } 
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione asincrona che effettua la validazione sullo storico delle aste (visualizza tutte le aste effettuate in un 
 * determinato periodo temporale)
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function storicoAsteVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(typeof req.body.username != "string") 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            if(user){
                await PartecipazioneClass.getPartecipazioniByUsername(req.body.username).then((result)=>{
                    res.message = "Richiesta avvenuta con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    res.data = {"elenco_aste": {
                        "aste_vinte":result.aste_vinte,
                        "aste_perse":result.aste_perse,
                    }};
                    next();
                });
            }
            else{
                errorResp = new Error("Operazione non permessa");;
            }
        } 
        if(errorResp instanceof Error)
            next(errorResp);
    }catch(error){
        next(error)
    }
};
/**
 * Funzione asincrona che effettua la validazione sulle spese effettuate durante tutte le partecipazioni (storico)
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function speseEffettuateVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawTimeStampFilter(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => { 
                return user;
            });
            if(user){
                await PartecipazioneClass.filterPartecipazioniByDate(req.body).then((partecipazioni:any) =>{
                    res.message = "Richiesta avvenuta con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    res.data = {"partecipazioni": partecipazioni};
                    next();
                });
            }
            else{
                errorResp = new Error("Operazione non permessa");
            }
        }
        if(errorResp instanceof Error)
            next(errorResp)  
    }catch(error){
        next(error)
    }
};
////////////////////////////
//DA IMPLEMENTARE
/**
 * Funzione asincrona che valida le statistiche dell'asta secondo il numero di partecipazioni
 * @param req identifica la richiesta
 * @param res identifica la risorsa
 * @param next passa al prossimo middleware
 */
export async function statsVal(req:any,res:any,next:any) {
    let errorResp:any;
    try{
        if(!formatRequestValidator.validateRawTimeStampFilter(req.body)) 
            errorResp = new Error("Errore di formattazione del payload");
        else{
            const user = await UserClass.userIsAdmin(req.body.username).then((user) => { 
                return user;
            });
            if(user){

                //statistiche
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"partecipazioni": "stats"};
                next();

                
            }
            else{
                errorResp = new Error("Operazione non permessa");
            }
        } 
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};