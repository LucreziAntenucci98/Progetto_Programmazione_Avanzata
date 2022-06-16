require('dotenv').config();
import { Sequelize } from 'sequelize';

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