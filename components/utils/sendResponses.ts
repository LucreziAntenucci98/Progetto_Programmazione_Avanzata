import { ResponseHttpBuilder } from "../response/ResponseHttpBuilder";

export const sendSuccessReponsePOST = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let json = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(json);
};

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

export const sendErrorMessage = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let json = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(json);
}

