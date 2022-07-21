import { ResponseHttp } from "../response/ResponseHttp";
import { ResponseHttpBuilder } from "../response/ResponseHttpBuilder";
import {Msg} from "./Msg";
const {StatusCode} = require('status-code-enum')


class AstaCreataMsg implements Msg{
    getMsg(data): ResponseHttp{
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.SuccessCreated)
                       .setStatus("Created")
                       .setMessage("Asta creata con successo!")
                       .setData(data)
                       .build();
    }
}

class IscrizioneAsta implements Msg{
    getMsg(data): ResponseHttp{
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.SuccessOK)
                       .setStatus("OK")
                       .setMessage("Iscrizione all'asta avvenuta con successo")
                       .setData(data)
                       .build();
    }
}
class RilancioAvvenuto implements Msg{
    getMsg(data): ResponseHttp{
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.SuccessOK)
                       .setStatus("OK")
                       .setData(data)
                       .setMessage("Rilancio avvenuto con successo")
                       .build();
    }
}
class RicaricaAvvenuta implements Msg{
    getMsg(): ResponseHttp{
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.SuccessOK)
                       .setStatus("OK")
                       .setMessage("Ricarica Utente avvenuta con successo")
                       .build();
    }
}

class MessaggioOkGetGenerico implements Msg{
    getMsg(data): ResponseHttp{
        let response = new ResponseHttpBuilder();
        return response.setStatusCode(StatusCode.SuccessOK)
                       .setStatus("OK")
                       .setMessage("Richiesta avvenuta con successo")
                       .setData(data)
                       .build();
    }
}


export enum SuccessMsgEnum {
    NuovaAsta,
    IscrizioneAsta,
    RilancioAvvenuto,
    RicaricaAvvenuta,
    MessaggioOkGetGenerico
}

/**
 * Function 'getSuccessMsg'
 * 
 * Function invoked by the controller when successfully ending a route
 * 
 * @param type Type of the success message obtained (is one of the values of the {@link SuccessMsgEnum})
 * @returns An object of the {@link Msg} interface representing a success message  
 */
export function getSuccessMsg(type: SuccessMsgEnum): Msg{
    let msgval: Msg;
    switch(type){
        case SuccessMsgEnum.NuovaAsta:
            msgval = new AstaCreataMsg();
            break;
        case SuccessMsgEnum.IscrizioneAsta:
            msgval = new IscrizioneAsta();
            break;
        case SuccessMsgEnum.RilancioAvvenuto:
            msgval = new RilancioAvvenuto();
            break;
        case SuccessMsgEnum.RicaricaAvvenuta:
            msgval = new RicaricaAvvenuta();
            break;
        case SuccessMsgEnum.MessaggioOkGetGenerico:
            msgval = new MessaggioOkGetGenerico();
            break;    
    }
    return msgval;
}