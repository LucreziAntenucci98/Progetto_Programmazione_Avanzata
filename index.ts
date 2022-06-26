//importo le librerie
import validation = require("./components/middleware/middlewareValidation");
import * as sendResponses from "./components/utils/sendResponses"
import * as auth from './components/middleware/middlewareAuth'
import * as express from "express";
import {errorHandler} from "./components/middleware/middlewareErrorHandler";
import {OBAsta} from "./components/observer/observer"
import { ResponseHttpBuilder } from "./components/response/ResponseHttpBuilder";
import { Asta } from "./components/models/Asta";

//Lista dei subject
export let subjectList: Array<OBAsta> = [];
// Costanti
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//Rotta pubblica per la visualizzazione delle aste filtrando per lo stato con il metodo GET
app.get('/visualizzaAsteByStato',validation.visualizzaAsteByStatoVal, errorHandler, (req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});

app.use([
        auth.requestTime,
        auth.checkHeader,
        auth.checkToken,
        auth.verifyAndAuthenticate,
        errorHandler
        ]);

//Rotta per la creazione dell'asta con il metodo POST
app.post('/creaAsta', validation.insertBidVal, errorHandler, (req, res) => {
       sendResponses.sendSuccessReponsePOST(res);
});
//Rotta per la partecipazione all'asta con il metodo POST
app.post('/partecipaAsta', validation.partecipaAstaVal,  errorHandler, (req, res) => {
       sendResponses.sendSuccessReponsePOST(res);
});
//Rotta per il rilancio dell'asta con il metodo POST
app.post('/rilancia',validation.puntataVal,  errorHandler, (req, res) => {
       sendResponses.sendSuccessReponsePOST(res);
});
//Rotta per la ricarica utente con il metodo POST
app.post('/ricaricaUtente',validation.ricaricaUtenteVal,  errorHandler, (req, res) => {
       sendResponses.sendSuccessReponsePOST(res);
});
//Rotta che verifica il credito residuo con il metodo GET
app.get('/verificaCreditoResiduo', validation.verificaCreditoResiduoVal,  errorHandler, (req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});
//Rotta che visualizza l'elenco dei rilanci con il metodo GET
app.get('/elencoRilanci', validation.elencoRilanciVal,  errorHandler,(req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});
//Rotta per visualizzare lo storico dell'asta con il metodo GET
app.get('/storicoAste',validation.storicoAsteVal,  errorHandler,(req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});
//Rotta che visualizza tutte le spese effettuate dall'utente con il metodo GET
app.get('/speseEffettuate',validation.speseEffettuateVal,  errorHandler,(req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});
//Rotta che visualizza lo stato dell'asta (creata,aperta,rilancio,terminata) con il metodo GET
app.get('/stats', validation.statsVal, errorHandler,(req, res) => {
       sendResponses.sendSuccessReponseGET(res);
});

//in caso in cui si inserisca una rotta non esistente
app.get('*', function(req, res){
       res.header("Content-Type", "application/json");
       const response = new ResponseHttpBuilder();
       let json = JSON.stringify(response.setStatusCode(404)
                      .setStatus("Not found")
                      .setMessage("Rotta non trovata")
                      .build());
       res.status(res.status_code).send(json);
});

app.post('*', function(req, res){
       res.header("Content-Type", "application/json");
       const response = new ResponseHttpBuilder();
       let json = JSON.stringify(response.setStatusCode(404)
                      .setStatus("Not found")
                      .setMessage("Rotta non trovata")
                      .build());
       res.status(res.status_code).send(json);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);