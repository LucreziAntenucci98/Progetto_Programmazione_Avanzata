import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as User from "./User";

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
    num_attuale_partecipanti: {
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
        afterCreate: async (record, options) => {
            await record.update({ 'stato': 'aperta' });
        },
        afterUpdate: (record:any,options) => {
            if(record.stato === "rilancio"){
                console.log("ASTA IN FASE DI RILANCIO");
            }
        }
    }
});

/**
 * Funzione asincrona che valida inserimento dell'asta (se può essere inseira o meno)
 * @param asta identifica l'asta
 * @returns True se la validazione è andata a buon fine
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
 * @returns ritorna l'asta se essa esiste altrimenti errore
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