import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import { ErrorMsgEnum } from "../msgResponse/ErrorMsg";
import * as logger from "../utils/logger";

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Definizione dell'oggetto User per interfacciarsi con l'entità
 * "Users" presente nel DB
 */
 
export const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    credito: {
        type: DataTypes.INTEGER(),
        allowNull:false
    },
    ruolo: {
        type: DataTypes.STRING,
        allowNull:false
    }
}, 
{
    modelName: 'users',
    timestamps: false,
    freezeTableName: true
});
/**
 * Funzione che verifica se l'utente admin può ricaricare l'utente
 * @param ricarica  il "wallet" dell'utente
 * @returns True se è un User altrimenti False
 */
 export async function validatorRicaricaUtente(ricarica:any):Promise<any>{
    const userAdmin = await checkUserExistence(ricarica.username_admin).then((user) => { 
        if(user) return user;
        else return false;
    });
    if(!userAdmin ) return ErrorMsgEnum.UtenteNonEsiste;
    if(userAdmin.ruolo !== "admin") return ErrorMsgEnum.NoPermessi;

    const userDestinatario = await checkUserExistence(ricarica.username_destinatario).then((user) => { 
        if(user) return user;
        else return false;
    });
    if(!userDestinatario ) return ErrorMsgEnum.UtenteNonEsiste;
    if(userDestinatario.ruolo !== "bid_partecipant") return ErrorMsgEnum.NoPermessi;
    
    return true;
}

/**
 * Verifica l'esistenza dell'user
 * @param username identificatore del giocatore
 * @returns  il risultato 
 */
export async function checkUserExistence(username:string):Promise<any> {
    let result:any;
    try{
        result = await User.findByPk(username,{raw:true});
    }catch(error){
        logger.logError(error.stack)
    }
    return result;
};

/**
 * Verifica se l'utente è un admin
 * @param username identificatore dell'utente
 * @returns l'utente se ha ruolo di admin, false se non esiste o non ha ruolo di admin
 */
export async function userIsAdmin(username:string):Promise<boolean> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        logger.logError(error.stack)
    }
    if(!user) return false;
    if(user.ruolo == "admin") return user;
    else return false
};

/**
 * Verifica se l'utente è un bid_partecipant
 * @param username identificatore dell'utente
 * @returns l'utente se ha ruolo di bid_partecipant, false se non esiste o non ha ruolo di bid_partecipant
 */
export async function userIsBidPartecipant(username:string):Promise<any> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        logger.logError(error.stack)
    }
    if(!user) return false;
    if(user.ruolo == "bid_partecipant") return user;
    else return false
};

/**
 * Verifica se l'utente è un bid_creator
 * @param username identificatore dell'utente
 * @returns l'utente se ha ruolo di bid_creator, false se non esiste o non ha ruolo di bid_creator
 */
export async function userIsBidCreator(username:string):Promise<any> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        logger.logError(error.stack)
    }
    if(!user) return false;
    if(user.ruolo == "bid_creator") return user;
    else return false
};