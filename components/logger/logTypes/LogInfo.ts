import {Creator} from "../Creator";
import {LogMsg} from "../LogMsg";
import {ConcrateLogInfo} from "../concreteLogTypes/ConcreteLogInfo"
/**
*  Concrete Creators sovrascrive il metodo factory per modificare il
*  tipo di logger info
*/
export class LogInfo extends Creator {
    public factoryMethod(): LogMsg {
        /**
        * 
        * @returns L'oggetto che permette di scrivere sul file di log delle info
        */
        return new ConcrateLogInfo();
    }
}