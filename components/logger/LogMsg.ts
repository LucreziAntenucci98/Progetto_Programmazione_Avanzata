/**
 * The LogMsg interface declares the operations that all concrete products must
 * implement.
 */
 export interface LogMsg {
    printMsg(msg:string)
    getType(): string;
}