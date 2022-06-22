import {Creator} from "../logger/Creator"
import {LogError} from "../logger/logTypes/LogError"
import {LogInfo} from "../logger/logTypes/LogInfo"


function writeLog(creator: Creator,messaggio:string) {
    creator.writeMsg(messaggio);
}

/**
 * L'applicazione seleziona il tipo di creator a seconda della configurazione 
 * o ambiente
 * 
 */
export const logError = (messaggio:string) =>{
    writeLog(new LogError(),messaggio);
};

export const logInfo= (messaggio:string) =>{
    writeLog(new LogInfo(),messaggio)
}
