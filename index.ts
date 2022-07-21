//importo le librerie
import validation = require("./components/middleware/middlewareValidation");
import * as auth from './components/middleware/middlewareAuth'
import * as express from "express";
import {errorHandler} from "./components/middleware/middlewareErrorHandler";
import {OBAsta} from "./components/observer/observer"
import * as controller from "./components/controller"
import { ErrorMsgEnum, getErrorMsg } from "./components/msgResponse/ErrorMsg";

//Lista dei subject
export let subjectList: Array<OBAsta> = [];
// Costanti
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(express.json());

//Rotta pubblica per la visualizzazione delle aste filtrando per lo stato con il metodo GET
app.get('/visualizzaAsteByStato',validation.visualizzaAsteByStatoVal, errorHandler, (req, res) => {
       controller.filtraAsteByStato(req,res);
});

app.use([
        auth.requestTime,
        auth.checkHeader,
        auth.checkToken,
        auth.verifyAndAuthenticate,
        errorHandler
        ]);

//Rotta per la creazione dell'asta con il metodo POST
app.post('/creaAsta', validation.insertBidVal, errorHandler, (req:any,res:any) => {
       controller.insertBid(req,res);
});
//Rotta per la partecipazione all'asta con il metodo POST
app.post('/partecipaAsta', validation.partecipaAstaVal,  errorHandler, (req, res) => {
       controller.partecipaAsta(req,res);
});
//Rotta per il rilancio dell'asta con il metodo POST
app.post('/rilancia',validation.puntataVal,  errorHandler, (req, res) => {
       controller.rilancia(req,res);
});
//Rotta per la ricarica utente con il metodo POST
app.post('/ricaricaUtente',validation.ricaricaUtenteVal,  errorHandler, (req, res) => {
       controller.ricaricaUtente(req,res);
});
//Rotta che verifica il credito residuo con il metodo GET
app.get('/verificaCreditoResiduo', validation.verificaCreditoResiduoVal,  errorHandler, (req, res) => {
       controller.getCreditoResiduo(req,res);
});
//Rotta che visualizza l'elenco dei rilanci con il metodo GET
app.get('/elencoRilanci', validation.elencoRilanciVal,  errorHandler,(req, res) => {
       controller.getRilanci(req,res);
});
//Rotta per visualizzare lo storico dell'asta con il metodo GET
app.get('/storicoAste',validation.storicoAsteVal,  errorHandler,(req, res) => {
       controller.getStoricoAste(req,res);
});
//Rotta che visualizza tutte le spese effettuate dall'utente con il metodo GET
app.get('/speseEffettuate',validation.speseEffettuateVal,  errorHandler,(req, res) => {
       controller.getSpeseEffettuate(req,res);
});
//Rotta che visualizza lo stato dell'asta (creata,aperta,rilancio,terminata) con il metodo GET
app.get('/stats', validation.statsVal, errorHandler,(req, res) => {
       controller.getStats(req,res);
});

//in caso in cui si inserisca una rotta non esistente
app.get('*', function(req, res){
       res.header("Content-Type", "application/json");
       const new_err_msg = getErrorMsg(ErrorMsgEnum.RottaNonTrovata).getMsg();
       res.status(new_err_msg.getStatusCode()).json(new_err_msg);
});

app.post('*', function(req, res){
       res.header("Content-Type", "application/json");
       const new_err_msg = getErrorMsg(ErrorMsgEnum.RottaNonTrovata).getMsg();
       res.status(new_err_msg.getStatusCode()).json(new_err_msg);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);