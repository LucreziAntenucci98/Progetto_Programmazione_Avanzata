import * as AstaClass from "./modelsDB/Asta";
import * as logger from "./utils/logger";
import { ErrorMsgEnum, getErrorMsg } from "./msgResponse/ErrorMsg"
import { getSuccessMsg, SuccessMsgEnum } from "./msgResponse/SuccessMsg";
import { ResponseHttp } from "./response/ResponseHttp";
import * as UserClass from "./modelsDB/User";
import * as PartecipazioneClass from "./modelsDB/Partecipazione";
import * as PuntataClass from "./modelsDB/Puntata"
import { User } from "./modelsDB/User";
const { Op } = require("sequelize");

export function controllerErrors(error:any,res: any) {
    logger.logError(error.stack);
    const new_err_msg = getErrorMsg(ErrorMsgEnum.ServerErrorInternal).getMsg();
    res.status(new_err_msg.getStatusCode()).json(new_err_msg);
}

export async function insertBid(req: any, res: any): Promise<void> {
    try {
        await AstaClass.Asta.create(req.body).then((asta: any) => {
            //scrittura sul file di log delle info
            logger.logInfo(`L'asta con id ${asta.id_asta} è stata creata`)
            //dati aggiuntivi
            const data = { "id_asta": asta.id_asta }
            //creazione risposta
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.NuovaAsta).getMsg(data);
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });
    } catch(error) {
        controllerErrors(error,res);
    }
}

export async function partecipaAsta(req: any, res: any) {
    try {
        const asta = await AstaClass.Asta.findByPk(req.body.id_asta, { raw: true }).then((result: any) => {
            return result;
        });
        const quota_partecipazione = asta.quota_partecipazione;
        req.body.spesa_partecipazione = quota_partecipazione;
        await PartecipazioneClass.Partecipazione.create(req.body).then(() => {
            logger.logInfo(`L'utente ${req.body.username} partecipa all'asta ${req.body.id_asta}`);
            //creazione risposta
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.IscrizioneAsta).getMsg();
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });
    }
    catch(error) {
        controllerErrors(error,res);
        controllerErrors(error,res);
    }
}

export async function rilancia(req: any, res: any) {
    try {
        logger.logInfo(`L'utente ${req.body.username} rilancia all'asta ${req.body.id_asta}`);

        await PartecipazioneClass.Partecipazione.increment(
            ['contatore_puntate'],
            {
                by: 1,
                where: {
                    id_asta: req.body.id_asta,
                    username: req.body.username
                }
            });
        let partecipazione = await PartecipazioneClass.getPartecipazioniByUsernameIdAsta(req.body.username, req.body.id_asta);
        let asta = await AstaClass.checkAstaExistence(req.body.id_asta);
        req.body.id_partecipazione = partecipazione.id_partecipazione;
        await PuntataClass.Puntata.create(req.body).then(() => {
            let data = {
                "id_asta": req.body.id_asta,
                "puntate_rimaste": asta.max_n_puntate_partecipante - partecipazione.contatore_puntate
            }
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.RilancioAvvenuto).getMsg(data);
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });
    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function ricaricaUtente(req: any, res: any) {
    try {
        await User.increment(['credito'], { by: req.body.quantita, where: { username: req.body.username_destinatario } })
        logger.logInfo(`L'utente ${req.body.username} è stato ricaricaricato di ${req.body.quantita} token`);
        let data = { "valore_ricarica": req.body.quantita };
        const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.RicaricaAvvenuta).getMsg(data);
        //invio risposta
        res.header("Content-Type", "application/json");
        res.status(response.getStatusCode()).end(JSON.stringify(response));

    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function getCreditoResiduo(req: any, res: any) {
    try {
        const user = await UserClass.userIsBidPartecipant(req.body.username).then((user) => {
            return user;
        });
        let data = { "credito": user.credito };
        const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg(data);
        //invio risposta
        res.header("Content-Type", "application/json");
        res.status(response.getStatusCode()).end(JSON.stringify(response));
    }
    catch(error) {
        controllerErrors(error,res);
    }
}


export function getRilanci(req: any, res: any) {
    try {
        const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg(res.data);
        //invio risposta
        res.header("Content-Type", "application/json");
        res.status(response.getStatusCode()).end(JSON.stringify(response));
    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function filtraAsteByStato(req: any, res: any) {
    try {
        await AstaClass.Asta.findAll({
            where:
                { stato: req.query.stato }, raw: true
        }).then((aste: any) => {
            let data = { "elenco_aste": aste };
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg(data);
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });
    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function getStoricoAste(req: any, res: any) {
    try {
        await PartecipazioneClass.getPartecipazioniByUsername(req.body.username).then((result) => {
            let data = {
                "elenco_aste": {
                    "aste_vinte": result.aste_vinte,
                    "aste_perse": result.aste_perse,
                }
            };
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg(data);
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });
    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function getSpeseEffettuate(req: any, res: any) {
    try {
        await PartecipazioneClass.filterPartecipazioniByDate(req.body).then((partecipazioni) => {
            let somma_spese = 0;
            if (partecipazioni.length > 0)
                somma_spese = partecipazioni.map(obj => obj.spesa_partecipazione)
                    .reduce(function (pre, cur) {
                        return pre + cur;
                    });
            let data = {
                "spese_totali": somma_spese,
                "partecipazioni": partecipazioni
            };
            const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg(data);
            //invio risposta
            res.header("Content-Type", "application/json");
            res.status(response.getStatusCode()).end(JSON.stringify(response));
        });

    }
    catch(error) {
        controllerErrors(error,res);
    }
}

export async function getStats(req: any, res: any) {
    //statistiche
    try {
        let data = {
            n_aste_completate_successo: 0,
            n_aste_terminate_insufficienza_iscritti: 0,
            rapporto_puntate_effettuate_puntate_max: 0,
        };

        //numero aste completate con successo
        //un asta è completata con successo se l'username del vincitore è diverso da ""

        const { count, rows } = await AstaClass.Asta.findAndCountAll({
            raw: true,
            where: {
                stato: "terminata",
                username_vincitore: {
                    [Op.ne]: ""
                },
                raggiungimento_min_iscritti: true
            }
        });

        data.n_aste_completate_successo = count;

        //numero aste terminate per insufficienza di iscritti
        //un asta è terminate per insufficienza di iscritti se raggiungimento_min_iscritti = false

        const { count_aste, rows_aste } = await AstaClass.Asta.findAndCountAll({
            where: {
                stato: "terminata",
                username_vincitore: "",
                raggiungimento_min_iscritti: false
            }
        }).then((r) => {
            return {
                count_aste: r.count,
                rows_aste: r.rows
            };
        });

        data.n_aste_terminate_insufficienza_iscritti = count_aste;

        //media del rapporto tra numero di puntate effettuate e numero max di puntate effettuabili

        if (rows.length == 0) data.rapporto_puntate_effettuate_puntate_max = 0
        else data.rapporto_puntate_effettuate_puntate_max =
            rows.map(obj => obj.num_puntate_totali / (obj.num_attuale_partecipanti * obj.max_n_puntate_partecipante))
                .reduce(function (pre, cur) {
                    return pre + cur;
                }) / rows.length;

        const response: ResponseHttp = getSuccessMsg(SuccessMsgEnum.MessaggioOkGetGenerico).getMsg({ "stats": data });
        //invio risposta
        res.header("Content-Type", "application/json");
        res.status(response.getStatusCode()).end(JSON.stringify(response));

    }
    catch(error) {
        controllerErrors(error,res);
    }
}
