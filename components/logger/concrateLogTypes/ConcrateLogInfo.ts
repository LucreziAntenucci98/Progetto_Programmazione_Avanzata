import { writeFile } from "fs";
import {LogMsg} from "../LogMsg";
/**
 * Classe utilizzata per scrivere il file di log con informazioni generiche.
 * Va a scrivere il file dulla cartella info con il formato annomesegiorno_info.log
 */
export class ConcrateLogInfo implements LogMsg {
    private type:string = "info";

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
        writeFile('storage/logs/info/'+fullDate+'_info.log',"[ Info: "+date.toLocaleString()+" ]"+ msg, {
            encoding: "utf8",
            flag: "a+"
        },(err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
}