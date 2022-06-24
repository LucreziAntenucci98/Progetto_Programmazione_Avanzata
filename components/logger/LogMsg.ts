/**
 * L'interfaccia LogMsg dichiara le operazioni che possono essere fatte
 */
 export interface LogMsg {
    writeMsg(msg:string)
    getType(): string;
}