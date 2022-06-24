import { ResponseHttp} from './ResponseHttp';
/**
 * Classe utilizzata per comporre la risposta da inviare all'utente
 */
export class ResponseHttpBuilder{
    private status:string;
    private status_code:number;
    private messaggio:string;
    private data:any;

    constructor(){

    }
    //Si settano i dati
    setData(data:any){
        this.data = data;
        return this;
    }
    //Si settano i dati della risposta 
    setStatus(status:string){
        this.status = status;
        return this;
    }
    //Si setta il Messaggio di risposta
    setMessage(messaggio:string){
        this.messaggio = messaggio;
        return this;
    }
    //Si setta il codice dello stato della risposta HTTP
    setStatusCode(status_code:number){
        this.status_code = status_code;
        return this;
    }
    //Getter dello status
    getStatus():string{
        return this.status;
    }
    //Getter del codice dello stato
    getStatus_code():number{
        return this.status_code;
    }
    //Getter del messaggio di risposta HTTP
    getMessage():string{
        return this.messaggio;
    }
    //Getter dei dati
    getData():any{
        return this.data;
    }
    //Costruisce l'oggetto
    build() {
        return new ResponseHttp(this);
    }
}