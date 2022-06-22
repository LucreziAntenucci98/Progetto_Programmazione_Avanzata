//Serve per configurare il file .env
require('dotenv').config();
//Libreria Sequelize
import { Sequelize } from 'sequelize';

/**
 * Classe Singleton per essere sicuri di avere
 * un'unica connessione al DataBase
 */
export class DatabaseSingleton {
    private static instance: DatabaseSingleton;
    
    private connessione: Sequelize;

    private constructor() {
		this.connessione = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
			host: process.env.PGHOST,
			port: Number(process.env.PGPORT),
			dialect: 'postgres'
		});
	}

    public static getInstance(): DatabaseSingleton {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }

        return DatabaseSingleton.instance;
    }
    public getConnessione(){
        return this.connessione;
    }
}