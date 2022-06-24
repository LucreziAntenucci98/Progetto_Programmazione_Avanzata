import { ResponseHttpBuilder } from './ResponseHttpBuilder';
/**
 * Classe  che contiene gli attributi per comporre la risposta da inviare all'utente
 */
export class ResponseHttp {

    private status:string;
    private status_code:number;
    private messaggio:string;
    private data:any;

    constructor(httpResponse: ResponseHttpBuilder) {
        this.status = httpResponse.getStatus();
        this.status_code = httpResponse.getStatus_code();
        this.messaggio = httpResponse.getMessage();
        this.data = httpResponse.getData();
    }
}