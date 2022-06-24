import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { checkUserExistence, User } from "./User";
import { Asta, checkAstaExistence } from "./Asta";
import { subjectList } from "../..";

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Definizione dell'oggetto partecipazione per interfacciarsi con l'entità
 * "Partecipazione" presente nel DB
 */

export const Partecipazione = sequelize.define('partecipazione', {
    id_partecipazione: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    id_asta: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(),
        allowNull: false   
    },
    spesa_partecipazione: {
        type: DataTypes.INTEGER(),
        allowNull: false,
    },
    asta_vinta: {
        type: DataTypes.BOOLEAN(),
        defaultValue: false,
        allowNull: false
    },
    contatore_puntate: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0
    },
    timestamp_partecipazione:  {
        type: DataTypes.DATE(),
        allowNull:false,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, 
{
    modelName: 'partecipazione',
    timestamps: false,
    freezeTableName: true
});

/**
 * 
 * @param partecipazione identifica i dati che l'utente invia 
 * @returns la partecipazione se esiste altrimenti restituisce un oggetto Errore con il relativo messaggio
 */
export async function checkPartecipazioneExistence(partecipazione:any):Promise<any> {
    let result:any;
    try{
        //select by id_asta by username
        result = await Partecipazione.findAll({raw:true,where:
            {id_asta: partecipazione.id_asta,
             username:partecipazione.username},
        });
    }catch(error){
        console.log(error);
    }
    return result;
};


/**
 * Funzione che valida la partecipazione effettiva dell'utente(si fanno i controlli di accesso)
 * @param partecipazione identifica l'utente che si inserisce per partecipare all'asta
 * @returns true se può partecipare altrimenti 
 * restituisce un oggetto Errore con il relativo messaggio
 */
export async function validatorInsertPartecipazione(partecipazione:any):Promise<any>{
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

    if(!asta ) return new Error("L'asta non esiste");
    if((asta.quota_partecipazione + asta.max_prezzo_asta) > user.credito) return new Error("Non hai credito sufficiente per eseguire l'operazione");
    if(asta.num_attuale_partecipanti === asta.max_partecipanti) return new Error("Non ci sono posti disponibili");
    if(asta.stato === "creata" || asta.stato === "terminata" ) return new Error("L'asta non è in fase di aperta o di rilancio");

    const partecipazioneObj = await checkPartecipazioneExistence(partecipazione).then((partecipazione) => { 
        if(partecipazione) return partecipazione;
        else return false;
    });

    if(partecipazioneObj.length != 0) return new Error("L'utente è gia iscritto");

    //Safe zone
    await Asta.increment(['num_attuale_partecipanti'],{by: 1,where:{id_asta: asta.id_asta}}).then(() => { 
        subjectList[asta.id_asta-1].AggiuntaPartecipante();
    });
    await User.decrement(['credito'],{by: asta.quota_partecipazione,where:{username: user.username}});
    
    return true;
}
/**
 * Funzione che permette di ottenere le partecipazioni delle aste effettuate dagli utenti
 * @param username identifica il nome dell'utente
 * @returns il numero di partecipazioni dell'utente suddividendole in
 * aste vinte e aste non vinte
 */
export async function getPartecipazioniByUsername(username) {
    let result = {aste_vinte:[],aste_perse:[]};
    
    result.aste_vinte = await Partecipazione.findAll({where:
            {username:username,
             asta_vinta:true
            },
    });
    result.aste_perse = await Partecipazione.findAll({where:
        {username:username,
         asta_vinta:false
        },
    });
    return result;
}

/**
 * Funzione asincrona che filtra le partecipazioni per data_inizio e data_fine
 * @param data contiene data_inizio e data_fine
 * @returns  tutte le partecipazioni effettuate in un intervallo di tempo ordinandole 
 * per data di partecipazione
 */

export async function filterPartecipazioniByDate(data:any):Promise<any>{
    return await Partecipazione.findAll({
        where: {
          username: data.username,
          timestamp_partecipazione: {
            [Op.between]: [data.data_inizio, data.data_fine],
          },
        },
        order: ['timestamp_partecipazione'],
    });


}