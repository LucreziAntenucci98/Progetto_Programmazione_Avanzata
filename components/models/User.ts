import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

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
    if(!userAdmin ) return new Error("Utente non esistente");
    if(userAdmin.ruolo !== "admin") return new Error("L'utente deve avere ruolo admin");

    const userDestinatario = await checkUserExistence(ricarica.username_destinatario).then((user) => { 
        if(user) return user;
        else return false;
    });
    if(!userDestinatario ) return new Error("L'utente destinatario non esiste");
    if(userDestinatario.ruolo !== "bid_partecipant") return new Error("L'utente destinatario deve avere ruolo bid_partecipant");

    await User.increment(['credito'],{by: ricarica.quantita,where:{username: ricarica.username_destinatario}})
    
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
        console.log(error);
    }
    return result;
};


export async function userIsAdmin(username:string):Promise<boolean> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        console.log(error);
    }
    if(!user) return false;
    if(user.ruolo == "admin") return user;
    else return false
};

export async function userIsBidPartecipant(username:string):Promise<any> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        console.log(error);
    }
    if(!user) return false;
    if(user.ruolo == "bid_partecipant") return user;
    else return false
};

export async function userIsBidCreator(username:string):Promise<any> {
    let user:any;
    try{
        user = await User.findByPk(username,{raw:true});
    }catch(error){
        console.log(error);
    }
    if(!user) return false;
    if(user.ruolo == "bid_creator") return user;
    else return false
};