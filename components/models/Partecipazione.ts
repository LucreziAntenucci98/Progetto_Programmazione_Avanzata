import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { checkUserExistence, User } from "./User";
import { Asta, checkAstaExistence } from "./Asta";
import { subjectList } from "../..";
import { OBAsta, RaggiungimentoPartecipanti } from "../observer/observer";

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
        let listaFiltrata: OBAsta[];
        if(subjectList.length != 0) listaFiltrata = subjectList.filter((element) => { return(element.id_asta === asta.id_asta)} );
        //Nel caso di riavvio del sistema, la subjectList è vuota quindi bisogna aggiungere
        //l'asta per poterla monitorare 
        if(listaFiltrata.length==0){
            const subject = new OBAsta(asta.id_asta,asta.min_partecipanti,asta.durata_asta_minuti);
            subjectList.push(subject)
            //Viene creato l'observer che verrà "attaccato" al subject
            const observer = new RaggiungimentoPartecipanti();
            listaFiltrata = subjectList.filter((element) => { return (element.id_asta === asta.id_asta) } )
            listaFiltrata[0].attach(observer);
        }
        listaFiltrata[0].AggiuntaPartecipante();
    });
    await User.decrement(['credito'],{by: asta.quota_partecipazione,where:{username: user.username}});
    
    return true;
}
/**
 * Funzione che permette di ottenere le partecipazioni delle aste effettuate dagli utenti
 * @param username identifica il nome dell'utente
 * @returns le partecipazioni dell'utente suddividendole tra le
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
 * Funzione che permette di ottenere la partecipazione dell'utente per una particolare asta
 * @param username identifica il nome dell'utente
 * @param id_asta identifica l'id dell'asta
 * @returns la partecipazione dell'utente
 */
 export async function getPartecipazioniByUsernameIdAsta(username,id_asta) {
    
    let partecipazioni:any[] = await Partecipazione.findAll({where:
            {username:username,
             id_asta:id_asta
            },
            raw:true
    }).then((partecipazioni:any[])=> {return partecipazioni});
    return partecipazioni[0];
}

/**
 * Funzione asincrona che filtra le partecipazioni per data_inizio e data_fine
 * @param data contiene data_inizio e data_fine
 * @returns  tutte le partecipazioni effettuate in un intervallo di tempo ordinandole 
 * per data di partecipazione
 */

export async function filterPartecipazioniByDate(data:any):Promise<any[]>{
    return await Partecipazione.findAll({
        where: {
          username: data.username,
          timestamp_partecipazione: {
            [Op.between]: [data.data_inizio, data.data_fine],
          },
        },
        attributes: ['id_partecipazione', 'spesa_partecipazione', 'timestamp_partecipazione' ],
        order: ['timestamp_partecipazione'],
    });


}