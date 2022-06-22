import {Creator} from "../Creator";
import {LogMsg} from "../LogMsg";
import {ConcrateLogInfo} from "../concrateLogTypes/ConcrateLogInfo"
/**
*  Concrete Creators sovrascrive il metodo factory per modificare il
*  tipo di logger info
*/
export class LogInfo extends Creator {
    public factoryMethod(): LogMsg {
        return new ConcrateLogInfo();
    }
}