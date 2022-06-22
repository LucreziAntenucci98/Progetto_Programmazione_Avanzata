import {Creator} from "../Creator"
import {LogMsg} from "../LogMsg";
import {ConcrateLogError} from "../concrateLogTypes/ConcrateLogError"


/**
*  Concrete Creators sovrascrive il metodo factory per modificare il
*  tipo di logger error.
*/
 export class LogError extends Creator {

    public factoryMethod(): LogMsg {
        return new ConcrateLogError();
    }
}