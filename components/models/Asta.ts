import { DatabaseSingleton } from "./singletone/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

export const Asta = sequelize.define('asta', {
    id_asta: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    }
}, 
{
    modelName: 'asta',
    timestamps: false,
    freezeTableName: true
});