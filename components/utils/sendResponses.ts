import { ResponseHttpBuilder } from "../response/ResponseHttpBuilder";
/**
 * Invio della risposta in caso di successo (POST) 
 * @param res contiene i parametri per comporre la risposta HTTP
 */
export const sendSuccessReponsePOST = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let json = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(json);
};
/**
 * Invio della risposta in caso di successo (GET) 
 * @param res contiene i parametri per comporre la risposta HTTP
 */
export const sendSuccessReponseGET = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let json = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .setData(res.data)
            .build());
    res.status(res.status_code).send(json);
};

/**
 * Invio della risposta in caso di successo (Errori) 
 * @param res contiene i parametri per comporre la risposta HTTP
 */
export const sendErrorMessage = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let json = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(json);
}

