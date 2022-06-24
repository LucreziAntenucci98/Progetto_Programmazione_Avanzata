import {Creator} from "../Creator"
import {LogMsg} from "../LogMsg";
import {ConcrateLogError} from "../concrateLogTypes/ConcrateLogError"


/**
*  Concrete Creators sovrascrive il metodo factory per modificare il
*  tipo di logger error.
*/
 export class LogError extends Creator {
    /**
     * 
     * @returns L'oggetto che permette di scrivere sul file di log degli errori
     */
    public factoryMethod(): LogMsg {
        return new ConcrateLogError();
    }
}