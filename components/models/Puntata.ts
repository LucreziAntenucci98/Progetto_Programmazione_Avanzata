import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import { checkUserExistence } from "./User";
import { checkAstaExistence } from "./Asta";
import { checkPartecipazioneExistence } from "./Partecipazione";

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

//Per poter puntare bisogna essere un bid-partecipant
export async function validatorInsertPuntata(partecipazione:any):Promise<any>{
    const user = await checkUserExistence(partecipazione.username).then((user) => { 
        if(user) return user;
        else return false;
    });

    if(!user ) return new Error("Utente non esistente");
    if(user.ruolo !== "bid_partecipant") return new Error("L'utente deve avere il ruolo di bid_partecipant");
    
    const asta = await checkAstaExistence(partecipazione.id_asta).then((asta) => { 
        if(asta) return asta;
        else return false;
    });

    if(!asta) return new Error("L'asta non esiste");
    if(asta.stato !== "aperta" ) return new Error("L'asta non è in fase di rilancio"); //sarebbe rilancio 

    const partecipazioneObj = await checkPartecipazioneExistence(partecipazione).then((partecipazione:any) => { 
        if(partecipazione) return partecipazione;
        else return false;
    });

    if(!partecipazioneObj)  return new Error("L'utente non è un partecipante dell'asta");
    if(partecipazioneObj.length < 1) return new Error("L'utente non è un partecipante dell'asta");
    if(partecipazioneObj[0].contatore_puntate == asta.max_n_puntate_partecipante) return new Error("L'utente ha raggiunto il numero di puntate massimo");

    let resp = await Puntata.findAll({
        where: {
            "id_partecipazione": partecipazioneObj[0].id_partecipazione
        }
    }).then((data:any)=>{
        return data;
    });

    if((resp.length + 1) * asta.incremento_puntata > user.credito) 
        return new Error("Non hai credito sufficiente per rilanciare ancora");

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
    console.log(puntate);
    return puntate;
}

/**
 * 
 * @param id_partecipazione identificatore partecipazione
 * @returns le puntate effetttuate
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
 * 
 * @param req dati inviati dall'utente
 * @returns True se i dati sono inviati correttamente altrimenti False
 */
export async function visualizzaElencoRilanciVal(req: any):Promise<any>{
    const user = await checkUserExistence(req.body.username).then((user) => { 
        if(user) return user;
        else return false;
    });
    
    if(!user) return new Error("Utente non esistente");
    
    const asta = await checkAstaExistence(req.body.id_asta).then((asta) => { 
        if(asta) return asta;
        else return false;
    });

    if(!asta) return new Error("Asta non esistente");
    if(user.ruolo === "admin") 
        return new Error("L'utente deve avere un ruolo di bid_partecipant o di bid_creator");
        
    let puntate;

    switch (user.ruolo){
        case "bid_creator":{
            if(asta.username_creator !== req.body.username)
                return new Error("L'utente con ruolo bid_creator non è il creatore dell'asta");
            puntate = await getPuntateByIdAsta(req.body.id_asta).then((puntate:any)=>{
                return puntate; 
            });
            break;
        }
        case "bid_partecipant":{
            const partecipazione = await checkPartecipazioneExistence(req.body).then((partecipazione:any)=>{
                if(partecipazione) return partecipazione; 
                else return false;
            });
            
            if(!partecipazione) 
                return new Error("L'utente non ha partecipato all'asta");
            puntate = await getPuntateByIdPartecipazione(req.body.id_asta).then((puntate:any)=>{
                return puntate; 
            });

            break;
        }   
    }
    return puntate;
}