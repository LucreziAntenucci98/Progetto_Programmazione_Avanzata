import {Creator} from "../Creator";
import {LogMsg} from "../LogMsg";
import {ConcrateLogInfo} from "../concrateLogTypes/ConcrateLogInfo"

export class LogInfo extends Creator {
    public factoryMethod(): LogMsg {
        return new ConcrateLogInfo();
    }
}