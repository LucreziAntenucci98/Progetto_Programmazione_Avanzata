import {LogMsg} from "../LogMsg";
import { writeFile } from 'fs';

/**
 * Classe utilizzata per scrivere il file di log con gli errori.
 * Va a scrivere il file sulla cartella error con il formato annomesegiorno_error.log
 */
export class ConcrateLogError implements LogMsg {
    private type:string = "error";

    /**
     * Metodo getter del tipo di logger
     * @returns il tipo di logger
     */
    
    public getType(): string{
        return this.type;
    }

    /**
     * Metodo che permette di scrivere sul file di log giornaliero degli errori.
     * Il messaggio viene scritto utilizzando il seguente formato:
     * 
     * [Error:AnnoMeseGiorno-Ora:Minuto] messaggio di errore
     * 
     * @param msg Messaggio da scrivere sul file di log
     */

    public writeMsg(msg:string){
        const date = new Date();
        const fullDate = [
                            date.getFullYear(),
                            (date.getMonth() + 1).toString().padStart(2, '0'),
                            date.getDate().toString().padStart(2, '0'),
                        ].join('')
        
        writeFile('storage/logs/error/'+fullDate+'_error.log',"[ Error: "+date.toLocaleString()+" ]" + msg +"\n", {
            encoding: "utf8",
            flag: "a+"
        },(err) => {
            if (err) throw err;
            console.log('Scrittura sul file di log Error');
        });
    }
}