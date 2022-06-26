import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as User from "./User";
import { OBAsta, RaggiungimentoPartecipanti } from "../observer/observer";
import { subjectList } from "../../index";
import { Partecipazione } from "./Partecipazione";
import * as logger from "../utils/logger";
const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Definizione dell'oggetto asta per interfacciarsi con l'entità
 * "Asta" presente nel DB
 */

export const Asta = sequelize.define('asta', 
{
    id_asta: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true 
    },
    username_creator: {
        type: DataTypes.STRING(),
        allowNull: false 
    }, 
    nome_oggetto: {
        type: DataTypes.STRING(),
        allowNull: false 
    },
    min_partecipanti: {
        type: DataTypes.INTEGER(),
        allowNull: false 
    },
    max_partecipanti: {
        type: DataTypes.INTEGER(),
        allowNull: false 
    },
    quota_partecipazione: {
        type: DataTypes.INTEGER(),
        allowNull: false 
    },
    durata_asta_minuti: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
    stato: {
        type: DataTypes.STRING(),
        defaultValue: "creata",
        allowNull: false
    },
    incremento_puntata: {
        type: DataTypes.INTEGER(),
        allowNull: false,
    },
    max_n_puntate_partecipante: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    max_prezzo_asta: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    username_vincitore: {
        type: DataTypes.STRING(),
        defaultValue: ""
    },
    tot_prezzo_aggiudicato: {
        type: DataTypes.INTEGER(),
        defaultValue: 0
    },
    raggiungimento_min_iscritti:{
        type: DataTypes.BOOLEAN(),
        defaultValue: true
    },
    num_attuale_partecipanti: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
    },
    num_puntate_totali: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
    },
},
{
    modelName: 'asta',
    timestamps: false,
    freezeTableName: true,
    hooks:{
        afterCreate: async (record:any, options) => {
            //Dopo la creazione dell'asta passa ad aperta
            await record.update({ 'stato': 'aperta' });
            logger.logInfo(`Lo stato dell'asta ${record.id_asta} è passato allo stato aperta`);
            //Viene aggiunto il subject alla lista dei subject
            const subject = new OBAsta(record.id_asta,record.min_partecipanti,record.durata_asta_minuti);
            subjectList.push(subject)
            //Viene creato l'observer che verrà "attaccato" al subject
            const observer = new RaggiungimentoPartecipanti();
            const listaFiltrata: OBAsta[]= subjectList.filter((element) => { return (element.id_asta === record.id_asta) } )
            listaFiltrata[0].attach(observer);
            //impostazione timer di 5 minuti nel quale se alla fine del timer il numero di partecipanti è
            //minore del numero minimo l'asta termina, non c'è un vincitore
            setTimeout(async () => {
                const asta = await Asta.findByPk(record.id_asta);
                if(asta.num_attuale_partecipanti < asta.min_partecipanti){
                    //lo stato dell'asta va a terminata e si indica tramite
                    //il booleano 'raggiungimento_min_iscritti' a false che 
                    //non è stato raggiunto il numero minimo di iscritti
                    await Asta.update({stato: "terminata",raggiungimento_min_iscritti:false},{where:{"id_asta": asta.id_asta}});
                    console.log(`ASTA ${asta.id_asta} CHIUSA`);
                    console.log(`Lo stato dell'asta ${asta.id_asta} è passato allo stato terminata per insufficienza di iscritti`);
                    logger.logInfo(`Lo stato dell'asta ${asta.id_asta} è passato allo stato terminata per insufficienza di iscritti`);
                    //ricaricare utenti che si erano iscritti
                    const partecipazioni = await Partecipazione.findAll({
                        where: {
                            id_asta: asta.id_asta
                        },
                    }).then((partecipazioni:any)=>{
                       return partecipazioni;     
                    });
                    //ottengo lista di username iscritti
                    const usernameList:string[] = partecipazioni.map(part => part.username);
                    if(usernameList.length>0){
                        //incremento credito degli utenti che si erano iscritti 
                        await User.User.increment(['credito'],{by: asta.quota_partecipazione,where:{username: usernameList}});
                        //eliminare le partecipazioni
                        await Partecipazione.destroy({where:{username: usernameList,id_asta:asta.id_asta}});
                    }
                        
                }
            }, 300000);

        },
        afterUpdate: (record:any,options) => {
            if(record.stato === "rilancio"){
                console.log("ASTA IN FASE DI RILANCIO");
            }
        }
    }
});

/**
 * Funzione asincrona che valida inserimento dell'asta (se può essere inserita o meno)
 * @param asta identifica l'asta
 * @returns True se la validazione è andata a buon fine, in caso contrario un oggetto Error
 * 
 */

export async function validatorInsertAsta(asta:any):Promise<any>{
    const result = await User.checkUserExistence(asta.username_creator).then((user) => { 
        if(user) return user;
        else return false;
    });
    if(!result) return new Error("Utente non esistente");
    if(result.ruolo !== "bid_creator") return new Error("L'utente deve avere un ruolo bid_creator");
    return true
}
/**
 * Funzione asincrona che effettua un check sull'esistenza dell'asta attraverso il suo identificatore
 * @param id_asta identificatore asta
 * @returns ritorna l'asta se essa esiste
 */
export async function checkAstaExistence(id_asta:number):Promise<any> {
    let result:any;
    try{
        result = await Asta.findByPk(id_asta,{raw:true});
    }catch(error){
        console.log(error);
    }
    return result;
};