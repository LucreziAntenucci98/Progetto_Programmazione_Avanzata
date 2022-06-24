import {LogMsg} from "./LogMsg";
 /**
   * La classe Creator dichiara il metodo factory che restituisce un
   * oggetto della classe LogMsg. Le sottoclassi del Creator forniscono 
   * l'implementazione di questo metodo.
   */
 export abstract class Creator {

    public abstract factoryMethod(): LogMsg;

    public writeMsg(msg:string): void {
        const logger = this.factoryMethod();
        logger.writeMsg(msg) 
    }
}