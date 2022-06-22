/**
 * The LogMsg interface dichiara le operazioni che possono essere fatte
 */
 export interface LogMsg {
    printMsg(msg:string)
    getType(): string;
}