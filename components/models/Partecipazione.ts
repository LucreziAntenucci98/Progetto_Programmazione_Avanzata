import { DatabaseSingleton } from "./singletone/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

export const Partecipazione = sequelize.define('partecipazione', {
    id_partecipazione: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    }
}, 
{
    modelName: 'partecipazione',
    timestamps: false,
    freezeTableName: true
});