import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import { checkUserExistence } from "./User";
import { checkAstaExistence } from "./Asta";
import { checkPartecipazioneExistence } from "./Partecipazione";
import { ErrorMsgEnum } from "../msgResponse/ErrorMsg";

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Definizione dell'oggetto Puntata per interfacciarsi con l'entità
 * "Puntata" presente nel DB
 */

export const Puntata = sequelize.define('puntata', {
    id_puntata: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    id_partecipazione: {
        type: DataTypes.INTEGER(),
        allowNull:false
    },
    id_asta: {
        type: DataTypes.INTEGER(),
        allowNull:false
    },
    username: {
        type: DataTypes.STRING(),
        allowNull:false
    },
    time_ultimo_rilancio: {
        type: DataTypes.DATE(),
        allowNull:false,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, 
{
    modelName: 'puntata',
    timestamps: false,
    freezeTableName: true
});

/**
 * Funzione asincrona che valida inserimento della puntata da parte dell'utente
 * @param partecipazione dati inviati dall'utente
 * @returns false se non può puntare , True se può effettuare la puntata
 */

export async function validatorInsertPuntata(partecipazione:any):Promise<any>{

    const user = await checkUserExistence(partecipazione.username).then((user) => { 
        if(user) return user;
        else return false;
    });

    if(!user ) return ErrorMsgEnum.UtenteNonEsiste;
    if(user.ruolo !== "bid_partecipant") return ErrorMsgEnum.AstaNoStatoCorretto;

    const asta = await checkAstaExistence(partecipazione.id_asta).then((asta) => { 
        if(asta) return asta;
        else return false;
    });

    if(!asta) return ErrorMsgEnum.AstaNonEsiste;

    const partecipazioneObj = await checkPartecipazioneExistence(partecipazione).then((partecipazione:any) => { 
        if(partecipazione) return partecipazione;
        else return false;
    });

    if(!partecipazioneObj)  return ErrorMsgEnum.UtenteNoPartecipante;
    if(partecipazioneObj[0].contatore_puntate == asta.max_n_puntate_partecipante) 
        return ErrorMsgEnum.NumeroPuntateMaxRaggiunto;

    if(asta.stato !== "rilancio" ) return ErrorMsgEnum.AstaNoStatoCorretto; 

    let resp = await Puntata.findAll({
        where: {
            "id_asta": partecipazioneObj[0].id_asta
        }
    }).then((data:any)=>{
        return data;
    });

    if((resp.length + 1) * asta.incremento_puntata > asta.max_prezzo_asta) 
        return ErrorMsgEnum.PrezzoMaxAstaRaggiunto;
    if((resp.length + 1) * asta.incremento_puntata > user.credito) 
        return ErrorMsgEnum.NoCredito;

    return true;
}

/**
 * 
 * @param id_asta identificatore asta
 * @returns ritorna le puntate effettuate
 */
export async function getPuntateByIdAsta(id_asta:number):Promise<any>{
    const puntate = await Puntata.findAll({
        where: {
            "id_asta": id_asta
        },
        raw:true
    }).then((data:any)=>{
        return data;
    });
    return puntate;
}

/**
 * Funzione che ottiene le puntate effettuate dall'utente
 * @param id_partecipazione identificatore partecipazione
 * @returns le puntate effettuate
 */
export async function getPuntateByIdPartecipazione(id_partecipazione:number):Promise<any>{
    const puntate = await Puntata.findAll({
        where: {
            "id_partecipazione": id_partecipazione
        },
        raw:true
    }).then((data:any)=>{
        return data;
    });
    return puntate;
}

/**
 * Validazione della richiesta di visualizzazione dell'elenco
 * dei rilanci effettuata dall'utente
 * @param req dati valdati inviati dall'utente
 * @returns True se i dati sono inviati correttamente altrimenti False
 */
export async function visualizzaElencoRilanciVal(req: any):Promise<any>{
    const user = await checkUserExistence(req.query.username).then((user) => { 
        if(user) return user;
        else return false;
    });
    
    if(!user) return ErrorMsgEnum.UtenteNonEsiste;
    
    const asta = await checkAstaExistence(req.query.id_asta).then((asta) => { 
        if(asta) return asta;
        else return false;
    });

    if(!asta) return ErrorMsgEnum.AstaNonEsiste;
    if(asta.stato !== "rilancio") return ErrorMsgEnum.AstaNoStatoCorretto;
    if(user.ruolo === "admin") 
        return ErrorMsgEnum.NoPermessi;
        
    let puntate;

    switch (user.ruolo){
        case "bid_creator":{
            if(asta.username_creator !== req.query.username)
                return ErrorMsgEnum.NoPermessi;
            puntate = await getPuntateByIdAsta(req.query.id_asta).then((puntate:any)=>{
                return puntate; 
            });
            break;
        }
        case "bid_partecipant":{
            const partecipazione = await checkPartecipazioneExistence(req.query).then((partecipazione:any)=>{
                if(partecipazione) return partecipazione; 
                else return false;
            });
            
            if(!partecipazione[0]) 
                return ErrorMsgEnum.UtenteNoPartecipante;
            puntate = await getPuntateByIdPartecipazione(partecipazione[0].id_partecipazione).then((puntate:any)=>{
                return puntate; 
            });

            break;
        }   
    }
    return puntate;
}