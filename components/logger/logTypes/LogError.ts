import {Creator} from "../Creator"
import {LogMsg} from "../LogMsg";
import {ConcrateLogError} from "../concrateLogTypes/ConcrateLogError"


/**
 * Concrete Creators override the factory method in order to change the
 * resulting logger's type.
 */
 export class LogError extends Creator {
    /**
     * Note that the signature of the method still uses the abstract logger
     * type, even though the concrete logger is actually returned from the
     * method. This way the Creator can stay independent of concrete logger
     * classes.
     */
    public factoryMethod(): LogMsg {
        return new ConcrateLogError();
    }
}