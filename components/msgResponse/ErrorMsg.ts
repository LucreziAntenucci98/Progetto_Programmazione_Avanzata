// Import libraries
import { ResponseHttp } from "../response/ResponseHttp";
import { ResponseHttpBuilder } from "../response/ResponseHttpBuilder";
import {Msg} from "./Msg";
const {StatusCode} = require('status-code-enum')

class NoAuthHeader implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'header della richiesta non ha il parametro Authorization")
                       .build();
    }
}

class ErroreDiFirma implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("Dati non codificati correttamente")
                       .build();
    }   
}

class DatiFormattatiMale implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorBadRequest)
                       .setStatus("Bad Request")
                       .setMessage("Dati non formattati correttamente")
                       .build();
    }
}
class NoPermessi implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'utente non ha i permessi necessari")
                       .build();
    }
}
class NoCredito implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("Non hai credito sufficiente per eseguire l'operazione")
                       .build();
    }
}
class UtenteNonEsiste implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorNotFound)
                       .setStatus("Not Found")
                       .setMessage("L'utente non esiste")
                       .build();
    }
}
class AstaNonEsiste implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorNotFound)
                       .setStatus("Not Found")
                       .setMessage("L'asta non esiste")
                       .build();
    }
}

class NoPostiDisponibili implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("Non ci sono posti disponibili")
                       .build();
    }
}

class ServerErrorInternal implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ServerErrorInternal)
                       .setStatus("Internal Server Error")
                       .setMessage("Errore di comunicazione con il server")
                       .build();
    }
}

class UtenteGiaIscritto implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'utente è gia iscritto")
                       .build();
    }
}

class AstaNoStatoCorretto implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'asta non è nello stato corretto per eseguire l'operazione")
                       .build();
    }
}

class UtenteNoPartecipante implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'utente non è un partecipante all'asta")
                       .build();
    }
}

class RottaNonTrovata implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorNotFound)
                       .setStatus("Not Found")
                       .setMessage("La rotta non esiste")
                       .build();
    }
}

class NumeroPuntateMaxRaggiunto implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("L'utente ha raggiunto il numero di puntate massimo")
                       .build();
    }
}

class PrezzoMaxAstaRaggiunto implements Msg{
    getMsg(): ResponseHttp {
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.ClientErrorUnauthorized)
                       .setStatus("Unauthorized")
                       .setMessage("Non puoi puntare perchè è stato raggiunto il prezzo massimo dell'asta")
                       .build();
    }
}
let a = [

]
export enum ErrorMsgEnum {
       BadFormattedData = 1,
       NoPermessi = 2,
       UtenteNonEsiste = 3,
       ServerErrorInternal = 4,
       UtenteGiaIscritto = 5,
       AstaNonEsiste = 6,
       NoCredito = 7,
       NoPostiDisponibili = 8,
       AstaNoStatoCorretto = 9,
       UtenteNoPartecipante = 10,
       NumeroPuntateMaxRaggiunto = 11,
       PrezzoMaxAstaRaggiunto = 12,
       NoAuthHeader = 13,
       ErroreDiFirma = 14,
       RottaNonTrovata = 15
}

/**
 * Function 'getErrorMsg'
 * 
 * Function invoked by the Chains of Responsability middleware layers or controller when a route ends with an error
 * 
 * @param type Type of the error message obtained (is one of the values of the {@link ErrorMsgEnum})
 * @returns An object of the {@link Msg} interface representing an error message  
 */
export function getErrorMsg(type: ErrorMsgEnum): Msg{
    let msgval: Msg;
    switch(type){
        case ErrorMsgEnum.BadFormattedData:
            msgval = new DatiFormattatiMale();
            break;
        case ErrorMsgEnum.NoPermessi:
            msgval = new NoPermessi();
            break;
        case ErrorMsgEnum.UtenteNonEsiste:
            msgval = new UtenteNonEsiste();
            break;        
        case ErrorMsgEnum.ServerErrorInternal:
            msgval = new ServerErrorInternal();
            break;
        case ErrorMsgEnum.UtenteGiaIscritto:
            msgval = new UtenteGiaIscritto();
            break;
        case ErrorMsgEnum.AstaNonEsiste:
            msgval = new AstaNonEsiste();
            break;
        case ErrorMsgEnum.NoCredito:
            msgval = new NoCredito();
            break;
        case ErrorMsgEnum.NoPostiDisponibili:
            msgval = new NoPostiDisponibili();
            break;
        case ErrorMsgEnum.AstaNoStatoCorretto:
            msgval = new AstaNoStatoCorretto();
            break;
        case ErrorMsgEnum.UtenteNoPartecipante:
            msgval = new UtenteNoPartecipante();
            break;
        case ErrorMsgEnum.NumeroPuntateMaxRaggiunto:
            msgval = new NumeroPuntateMaxRaggiunto();
            break;
        case ErrorMsgEnum.PrezzoMaxAstaRaggiunto:
            msgval = new PrezzoMaxAstaRaggiunto();
            break;
        case ErrorMsgEnum.NoAuthHeader:
            msgval = new NoAuthHeader();
            break;
        case ErrorMsgEnum.ErroreDiFirma:
            msgval = new ErroreDiFirma();
            break;
        case ErrorMsgEnum.RottaNonTrovata:
            msgval = new RottaNonTrovata();
            break;
    }
    return msgval;
}