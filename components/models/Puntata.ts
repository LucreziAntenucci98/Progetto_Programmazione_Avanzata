import { DatabaseSingleton } from "./singletone/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

export const Puntata = sequelize.define('puntata', {
    id_puntata: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    }
}, 
{
    modelName: 'puntata',
    timestamps: false,
    freezeTableName: true
});