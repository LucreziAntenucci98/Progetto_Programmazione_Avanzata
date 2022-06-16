import {Creator} from "../logger/Creator"
import {LogError} from "../logger/logTypes/LogError"
import {LogInfo} from "../logger/logTypes/LogInfo"


function writeLog(creator: Creator,messaggio:string) {
    creator.writeMsg(messaggio);
}

/**
 * The Application picks a creator's type depending on the configuration or
 * environment.
 */
export const logError = (messaggio:string) =>{
    writeLog(new LogError(),messaggio);
};

export const logInfo= (messaggio:string) =>{
    writeLog(new LogInfo(),messaggio)
}
