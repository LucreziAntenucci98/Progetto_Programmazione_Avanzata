import {LogMsg} from "../LogMsg";
import { open, writeFile } from 'fs';
import { Buffer } from 'node:buffer';
/**
 * Concrete Products provide various implementations of the LogMsg interface.
 */
export class ConcrateLogError implements LogMsg {
    private type:string = "error";

    public getType(): string{
        return this.type;
    }

    public printMsg(msg:string){
        const date = new Date();
        const fullDate = [
                            date.getFullYear(),
                            (date.getMonth() + 1).toString().padStart(2, '0'),
                            date.getDate().toString().padStart(2, '0'),
                        ].join('')
        
        writeFile('storage/logs/error/'+fullDate+'_error.log',"[ Error: "+date.toLocaleString()+" ]" + msg, {
            encoding: "utf8",
            flag: "a+"
        },(err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
}